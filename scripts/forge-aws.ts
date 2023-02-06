import { ethers } from "ethers";
import fs from "fs";
import { join } from "path";

import { exec } from "child_process";

import DynasetTvlOracle from "artifacts/contracts/DynasetTvlOracle.sol/DynasetTvlOracle.json";
import ForgeV1 from "artifacts/contracts/ForgeV1.sol/ForgeV1.json";
import { getEthersAccount } from "scripts/ethers-provider";
import BigNumber from "bignumber.js";

import FORGE_ADDRESS from "./forge.json";

import { forgesToSetup } from "./tokens";

export const executeSwaps = async () => {
  const account = getEthersAccount();

  const forge = new ethers.Contract(FORGE_ADDRESS, ForgeV1.abi, account);

  const oracleAddress = await forge.dynasetTvlOracle();

  const dynasetOracle = new ethers.Contract(
    oracleAddress,
    DynasetTvlOracle.abi,
    account
  );

  let txn;

  txn = await dynasetOracle.updateWethPrice();

  await txn.wait();

  txn = await dynasetOracle.updateDynasetTokenPrices();

  await txn.wait();

  for (let i = 0; i < forgesToSetup.length; i++) {
    txn = await forge.startForging(i);

    await txn.wait();

    console.log("Started forging");
    const BATCH_SIZE = 50;

    txn = await forge.forgeFunction(i, BATCH_SIZE, {
      gasLimit: 800000,
    });

    await txn.wait();

    console.log("Forged");
  }
};

executeSwaps();
