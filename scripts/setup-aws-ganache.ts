import { ethers } from "ethers";
import fs from "fs";
import { join } from "path";

import { exec } from "child_process";

import UniswapV2Router02 from "@uniswap/v2-periphery/build/UniswapV2Router02.json";
import ERC20 from "@uniswap/v2-periphery/build/ERC20.json";
// import Dynaset from "build/contracts/Dynaset.json";
// import DynasetFactory from "build/contracts/DynasetFactory.json";
// import DynasetTvlOracle from "build/contracts/DynasetTvlOracle.json";
// import ERC20 from "build/contracts/IERC20.json";
// import ForgeV1 from "build/contracts/ForgeV1.json";
import Dynaset from "artifacts/contracts/Dynaset.sol/Dynaset.json";
import DynasetFactory from "artifacts/contracts/DynasetFactory.sol/DynasetFactory.json";
import DynasetTvlOracle from "artifacts/contracts/DynasetTvlOracle.sol/DynasetTvlOracle.json";
import ForgeV1 from "artifacts/contracts/ForgeV1.sol/ForgeV1.json";
import { getEthersAccount } from "scripts/ethers-provider";
import BigNumber from "bignumber.js";
import { forgesToSetup, testAmounts, USDC, WBTC, WETH } from "./tokens";
import { FORGES } from "./forges";

// import { time } from "@openzeppelin/test-helpers";

const TEST_WALLETS = [
  "0x60c750Cdf1f4Dc521815b5EA751f3A6E15313E6D",
  "0x9F80668723B44F065897037eD818eB49f3A5B122",
];

export const executeSwaps = async () => {
  const account = getEthersAccount();

  let txn;

  const dynasetFactoryFactory = new ethers.ContractFactory(
    DynasetFactory.abi,
    DynasetFactory.bytecode,
    account
  );
  const dynasetOracleFactory = new ethers.ContractFactory(
    DynasetTvlOracle.abi,
    DynasetTvlOracle.bytecode,
    account
  );
  const forgeFactory = new ethers.ContractFactory(
    ForgeV1.abi,
    ForgeV1.bytecode,
    account
  );

  const dynasetFactory = await dynasetFactoryFactory.deploy(account.address);

  txn = await dynasetFactory.deployDynaset(
    account.address,
    account.address,
    "Test Dynaset",
    "dynBTC"
  );

  await txn.wait();

  console.log("Deployed dynaset");

  const dynasetAddress = await dynasetFactory.dynasets(0);

  console.log("Dynaset: " + dynasetAddress);

  const dynasetOracle = await dynasetOracleFactory.deploy(dynasetAddress, 240);

  txn = await dynasetOracle.setMaximumObservationAge(5000000);

  await txn.wait();

  console.log("Deployed oracle");

  const uniswapRouter = new ethers.Contract(
    "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    UniswapV2Router02.abi,
    account
  );

  const swappingTokens = forgesToSetup
    .filter((t) => t !== WETH)
    .map((t) => t.address);

  for (const swapToken of swappingTokens) {
    txn = await uniswapRouter.swapETHForExactTokens(
      new BigNumber(
        (
          await uniswapRouter.getAmountsOut(
            new BigNumber(10).exponentiatedBy(18).toFixed(),
            [WETH.address, swapToken]
          )
        )[1].toString()
      )
        .times(0.95)
        .toFixed(0),
      [WETH.address, swapToken],
      account.address,
      1699109796,
      {
        gasLimit: 300000,
        value: `0x${new BigNumber(10).exponentiatedBy(18).toString(16)}`,
      }
    );

    await txn.wait();
  }

  console.log("Swapped");

  for (const testWallet of TEST_WALLETS) {
    txn = await account.sendTransaction({
      to: testWallet,
      // Convert currency unit from ether to wei
      value: ethers.utils.parseEther("1"),
    });
    await txn.wait();
  }

  for (const token of [WETH, USDC, WBTC]) {
    const tokenContract = new ethers.Contract(
      token.address,
      ERC20.abi,
      account
    );

    for (const testWallet of TEST_WALLETS) {
      if (testAmounts[token.symbol] === undefined) {
        continue;
      }
      // console.log(
      //   token.symbol,
      //   (await tokenContract.balanceOf(account.address)).toString(),
      //   new BigNumber(testAmounts[token.symbol])
      //     .times(
      //       new BigNumber(10).exponentiatedBy(
      //         (await tokenContract.decimals()).toString()
      //       )
      //     )
      //     .toFixed(0)
      // );
      txn = await tokenContract.transfer(
        testWallet,
        new BigNumber(testAmounts[token.symbol])
          .times(
            new BigNumber(10).exponentiatedBy(
              (await tokenContract.decimals()).toString()
            )
          )
          .toFixed(0)
      );

      await txn.wait();
    }

    txn = await tokenContract.approve(
      dynasetAddress,
      ethers.constants.MaxUint256
    );
    await txn.wait();
  }

  txn = await dynasetFactory.initialiseDynaset(
    dynasetAddress,
    [USDC.address, WBTC.address],
    ["1000000", "42000"],
    account.address,
    "500",
    "500"
  );

  await txn.wait();

  txn = await dynasetOracle.updateWethPrice();

  await txn.wait();

  txn = await dynasetOracle.updateDynasetTokenPrices();

  await txn.wait();

  await (account.provider as any).send("evm_increaseTime", [300]);
  await (account.provider as any).send("evm_mine", []);

  console.log("Initialized dynaset");

  const forge = await forgeFactory.deploy(
    account.address,
    dynasetAddress,
    dynasetOracle.address
  );

  fs.writeFileSync("./scripts/forge.json", JSON.stringify(forge.address));

  const dynaset = new ethers.Contract(dynasetAddress, Dynaset.abi, account);

  txn = await dynaset.setMintForge(forge.address);
  await txn.wait();
  txn = await dynaset.setBurnForge(forge.address);
  await txn.wait();

  txn = await dynaset.setDynasetOracle(dynasetOracle.address);
  await txn.wait();

  let i = 0;
  for (const forgeToken of forgesToSetup) {
    const forgeToSetup = FORGES[forgeToken.symbol];
    const tokenContract = new ethers.Contract(
      forgeToken.address,
      ERC20.abi,
      account
    );

    txn = await tokenContract.approve(
      forge.address,
      ethers.constants.MaxUint256
    );
    await txn.wait();

    txn = await forge.createForge(
      forgeToken.symbol === "WETH",
      forgeToken.address,
      forgeToSetup.limits.minContrib,
      forgeToSetup.limits.maxContrib,
      forgeToSetup.limits.maxCapital
    );
    await txn.wait();

    txn = await forge.setDeposit(true, i);
    await txn.wait();
    i++;
  }

  txn = await dynasetOracle.updateWethPrice();

  await txn.wait();

  txn = await dynasetOracle.updateDynasetTokenPrices();

  await txn.wait();

  // await time.increase(300);
  await (account.provider as any).send("evm_increaseTime", [300]);
  await (account.provider as any).send("evm_mine", []);

  txn = await dynasetOracle.updateDynasetTokenPrices();

  await txn.wait();

  // console.log(receipt.transactionHash);

  console.log("Forge deployed and configured: ", forge.address);
};

executeSwaps();
