const truffleAssert = require("truffle-assertions");
const web3 = require("web3");
const { time } = require("@openzeppelin/test-helpers");
const { toWei } = web3.utils;
const { fromWei } = web3.utils;
const MAX = web3.utils.toTwosComplement(-1);
const { default: Web3 } = require("web3");
const {
  swapFrom1nch,
  decodeswapFrom1nch,
} = require("../OneInchApi/oneinchApi");
const { assert } = require("hardhat");
const ERC20ABI = require("../build/contracts/TToken.json").abi;
// contracts
const Dynaset = artifacts.require("Dynaset");
const DynasetTvlOracle = artifacts.require("DynasetTvlOracle");
const USDCOracle = artifacts.require("UsdcOracle");
const Uniswapv3Oracle = artifacts.require("Uniswapv3Oracle");
const ChainlinkOracle = artifacts.require("ChainlinkOracle");
const Uniswapv2Oracle = artifacts.require("Uniswapv2Oracle");


contract("Dynaset", async (accounts) => {
  let admin = accounts[0];
  let dam = accounts[1];
  let user1 = accounts[2];
  let user2 = accounts[3];
  let mintForge = accounts[0];
  let burnForge = accounts[1];
  let dynaset;
  let weth;
  let usdc;
  let dai;
  let ntx;
  let sdao;


  let chainLinkOracle;
  let usdcOracle;
  let uniswapv3Oracle;
  let uniswapv2Oracle;


  const wethmainet = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const daimainet = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const usdcmainet = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const ntxmainnet = "0xF0d33BeDa4d734C72684b5f9abBEbf715D0a7935";
  const sdaomainnet = "0x5F058D0a4d6282d019C22Da9F80C1D6d90E8b01C";
  const wBtcmainNet = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599";
  // whales
  wethWhale = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  usdcWhale = "0x78605Df79524164911C144801f41e9811B7DB73D";
  daiWhale = "0x7A8EDc710dDEAdDDB0B539DE83F3a306A621E823";
  ntxWhale = "0xa6958bE926d13b18eE886c5b531021fD32d4B9c4";
  sdaoWhale = "0xe92Bd58a5C0d84D4aF48D8B7d28068bcB7a92f74";
  agixWhale = "0x82019e5dC34572eF5E437a2EC06FFF31e6f8ad3C";

  before(async () => {
    const Web3 = new web3("http://127.0.0.1:8545");
    weth = await new Web3.eth.Contract(ERC20ABI, wethmainet);
    usdc = await new Web3.eth.Contract(ERC20ABI, usdcmainet);
    dai = await new Web3.eth.Contract(ERC20ABI, daimainet);
    ntx = await new Web3.eth.Contract(ERC20ABI, ntxmainnet);
    sdao = await new Web3.eth.Contract(ERC20ABI, sdaomainnet);

    dynaset = await Dynaset.new(admin, dam, admin, "Dynaset weth/usd", "DYNWU");

      const uniswapv2Factory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
    const uniswapv3Factory = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
    const chainlink_feedRegistry = "0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf";

    chainLinkOracle = await ChainlinkOracle.new(chainlink_feedRegistry,usdcmainet,wethmainet,wBtcmainNet);
    uniswapv3Oracle = await Uniswapv3Oracle.new(uniswapv3Factory, 240, usdcmainet, wethmainet);
    uniswapv2Oracle = await Uniswapv2Oracle.new(uniswapv2Factory, 240, usdcmainet, wethmainet);
    
    usdcOracle = await USDCOracle.new(chainLinkOracle.address, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48")
    await usdcOracle.setFallbackOracles([uniswapv3Oracle.address,uniswapv2Oracle.address]);
    dynasetTvlOracle = await DynasetTvlOracle.new(dynaset.address,usdcmainet, usdcOracle.address);
    // required to initialize forge contracts

    // the admin has to approve the dynaset tokens so he can initialize dynaset
    // when initial.methodsizing the initial balances are taken from owners wallet.
    await weth.methods.approve(dynaset.address, MAX).send({ from: admin });
    await usdc.methods.approve(dynaset.address, MAX).send({ from: admin });
    await dai.methods.approve(dynaset.address, MAX).send({ from: admin });
    await ntx.methods.approve(dynaset.address, MAX).send({ from: admin });

    await ntx.methods.transfer(admin, web3.utils.toWei("15", "Mwei")).send({
      from: ntxWhale,
    });

    await weth.methods.transfer(admin, web3.utils.toWei("100")).send({
      from: wethWhale, // DAM address
    });

    await usdc.methods
      .transfer(admin, web3.utils.toWei("50000", "Mwei"))
      .send({ from: usdcWhale });

    await dai.methods
      .transfer(admin, web3.utils.toWei("5000"))
      .send({ from: daiWhale });

    // await sdao.methods
    //   .transfer(admin, web3.utils.toWei("5"))
    //   .send({ from: sdaoWhale });
  });

  describe("Configured Correctly", () => {
    it("has correct controller", async () => {
      const controllerAddress = await dynaset.getController();
      assert.equal(admin, controllerAddress);
    });

    it("admin can initialize", async () => {
      await truffleAssert.passes(
        dynaset.initialize(
          [wethmainet, daimainet, usdcmainet],
          [toWei("2"), toWei("4121"), toWei("4121", "Mwei")],
          admin
        )
      );
    });

    it("can not be initialized twice", async () => {
      await truffleAssert.fails(
        dynaset.initialize(
          [wethmainet, daimainet, usdcmainet, ntxmainnet],
          [
            toWei("2"),
            toWei("4121"),
            toWei("4121", "Mwei"),
            toWei("10", "Mwei"),
          ],
          // [toWei("25"), toWei("5"), toWei("5"), toWei("5")],
          admin
        )
      );
    });

    it("only admin can initialize", async () => {
      await truffleAssert.fails(
        dynaset.initialize(
          [wethmainet, daimainet, usdcmainet, ntxmainnet],
          [
            toWei("2"),
            toWei("4121"),
            toWei("4121", "Mwei"),
            toWei("10", "Mwei"),
          ],
          // [toWei("25"), toWei("5"), toWei("5"), toWei("5")],
          admin,
          { from: user1 }
        )
      );
    });

    it("Get current tokens", async () => {
      const currentTokens = await dynaset.getCurrentTokens();
      console.log(currentTokens);
      assert.sameMembers(currentTokens, [wethmainet, daimainet, usdcmainet]);
    });
  });

  describe("view functions", () => {
    it("can calculate tokens for amount", async () => {
      let dynasetAmount = toWei("100");
      let data = await dynaset.calcTokensForAmount(dynasetAmount);
      let tokens = data["tokens"];
      console.log("tokens", tokens);
      assert.equal(tokens.length, 3);
    });
  });

  describe("token swaps", () => {
    it("can swap uniswap", async () => {
      const wethBalanceBeforeSwap = await weth.methods
        .balanceOf(dynaset.address)
        .call();

      console.log(`weth balance before swap ${fromWei(wethBalanceBeforeSwap)}`);
      const usdcBalanceBeforeSwap = await usdc.methods
        .balanceOf(dynaset.address)
        .call();

      console.log(
        `usdc balance before swap ${fromWei(usdcBalanceBeforeSwap, "Mwei")}`
      );
      const amountIn = toWei("1");
      const minAmountOut = toWei("1", "Mwei");
      await truffleAssert.passes(
        dynaset.swapUniswap(wethmainet, usdcmainet, amountIn, minAmountOut, {
          from: dam,
        })
      );
      const wethBalanceAfterSwap = await weth.methods
        .balanceOf(dynaset.address)
        .call();
      console.log(`weth balance after swap ${fromWei(wethBalanceAfterSwap)}`);
      const usdcBalanceAfterSwap = await usdc.methods
        .balanceOf(dynaset.address)
        .call();

      console.log(
        `usdc balance after swap ${fromWei(usdcBalanceAfterSwap, "Mwei")}`
      );
      assert.equal(
        Number(fromWei(wethBalanceAfterSwap)) + Number(fromWei(amountIn)),
        fromWei(wethBalanceBeforeSwap)
      );
      assert.isTrue(
        fromWei(usdcBalanceAfterSwap, "Mwei") >=
          Number(fromWei(usdcBalanceBeforeSwap, "Mwei")) +
            Number(fromWei(minAmountOut, "Mwei"))
      );
    });

    it("can updade after swap", async () => {
      await truffleAssert.passes(
        dynaset.updateAfterSwap(wethmainet, usdcmainet)
      );
    });

    it("only dam can swap", async () => {
      const amountIn = toWei("1");
      const minAmountOut = toWei("1", "Mwei");
      await truffleAssert.fails(
        dynaset.swapUniswap(wethmainet, usdcmainet, amountIn, minAmountOut, {
          from: admin,
        })
      );
    });
  });

  describe("controller operations", () => {
    it("can add token", async () => {
      let minimumBalance = toWei("10", "Mwei");

      await ntx.methods
        .approve(dynaset.address, minimumBalance)
        .send({ from: admin });

      await truffleAssert.passes(
        dynaset.addToken(ntxmainnet, minimumBalance, admin, {
          from: dam,
        })
      );
      const currentTokens = await dynaset.getCurrentTokens();
      assert.sameMembers(currentTokens, [
        wethmainet,
        daimainet,
        usdcmainet,
        ntxmainnet,
      ]);
    });

    it("can remove token", async () => {
      // need to swap all tokens from dynaset before we can remove.
      let totalBalance = await dai.methods.balanceOf(dynaset.address).call();
      await truffleAssert.passes(
        dynaset.swapUniswap(daimainet, usdcmainet, totalBalance, toWei("0"), {
          from: dam,
        })
      );

      await truffleAssert.passes(dynaset.removeToken(daimainet, { from: dam }));
      const currentTokens = await dynaset.getCurrentTokens();
      console.log("current tokens", currentTokens);

      const { tokens } = await dynaset.calcTokensForAmount(toWei("1"));
      console.log("tokens", tokens);
      assert.sameMembers(tokens, currentTokens);
      assert.sameMembers(currentTokens, [wethmainet, usdcmainet, ntxmainnet]);
    });
  });

  describe("Forge Operations", () => {
    it("controller can set mint forge", async () => {
      await truffleAssert.passes(dynaset.setMintForge(mintForge));
    });

    it("controller can set burn forge", async () => {
      await truffleAssert.passes(dynaset.setBurnForge(burnForge));
    });

    it("can join dynaset", async () => {
      let dynasetAmount = toWei("15");

      await truffleAssert.passes(dynasetTvlOracle.updateDynasetTokenPrices());
      await time.increase(300);
      await truffleAssert.passes(dynasetTvlOracle.updateDynasetTokenPrices());

      let { tokens, amounts } = await dynaset.calcTokensForAmount(
        dynasetAmount
      );

      for (let i = 0; i < tokens.length; i++) {
        assert.equal(tokens[i], [wethmainet, ntxmainnet, usdcmainet][i]);
        // approve the transfer amounts
        await [weth, ntx, usdc][i].methods
          .approve(dynaset.address, MAX)
          .send({ from: mintForge });

        // transfer balance to the forge for joining dynaset
        await [weth, ntx, usdc][i].methods
          .transfer(mintForge, amounts[i])
          .send({ from: [wethWhale, ntxWhale, usdcWhale][i] });
        // test if the balance and allowences are correct
        let balance = await [weth, ntx, usdc][i].methods
          .balanceOf(mintForge)
          .call();
        let allowance = await [weth, ntx, usdc][i].methods
          .allowance(mintForge, dynaset.address)
          .call();
        assert.isTrue(fromWei(allowance) >= fromWei(amounts[i]));
        assert.isTrue(fromWei(balance) >= fromWei(amounts[i]));
      }
      await dynaset.setDynasetOracle(dynasetTvlOracle.address);
      let totalSupplyBeforeJoin = await dynaset.totalSupply();

      await truffleAssert.passes(
        dynaset.joinDynaset(dynasetAmount, { from: mintForge })
      );
      // const dynasetTVlAfter = await dynasetTvlOracle.dynasetTvlUsdc();

      // const tvlAdded = dynasetTVlAfter - dynasetTVlBefore;
      // const dynasetValuePerShare = await dynasetTvlOracle.dynasetUsdValuePerShare();

      let totalSupplyAfterJoin = await dynaset.totalSupply();
    });

    it("can exit dynaset", async () => {
      await dynaset.transfer(burnForge, toWei("10"), { from: mintForge });
      // let { tokens, amounts } = await dynaset.calcTokensForAmount(toWei("10"));
      await truffleAssert.passes(
        dynaset.exitDynaset(toWei("10"), { from: burnForge })
      );
    });

    it("only forge can join dynaset", async () => {
      await truffleAssert.fails(
        dynaset.joinDynaset(toWei("100"), { from: dam })
      );
    });

    it("only forge can exit dynaset", async () => {
      await truffleAssert.fails(
        dynaset.joinDynaset(toWei("100"), { from: dam })
      );
    });
  });

  describe("DYNToken interactions", () => {
    it("Token descriptors", async () => {
      const name = await dynaset.name();
      assert.equal(name, "Dynaset weth/usd");

      const symbol = await dynaset.symbol();
      assert.equal(symbol, "DYNWU");

      const decimals = await dynaset.decimals();
      assert.equal(decimals, 18);
    });

    it("Token allowances", async () => {
      await dynaset.approve(user1, toWei("50"));
      let allowance = await dynaset.allowance(admin, user1);
      assert.equal(fromWei(allowance), 50);

      await dynaset.increaseApproval(user1, toWei("50"));
      allowance = await dynaset.allowance(admin, user1);
      assert.equal(fromWei(allowance), 100);

      await dynaset.decreaseApproval(user1, toWei("50"));
      allowance = await dynaset.allowance(admin, user1);
      assert.equal(fromWei(allowance), 50);

      await dynaset.decreaseApproval(user1, toWei("100"));
      allowance = await dynaset.allowance(admin, user1);
      assert.equal(fromWei(allowance), 0);
    });

    it("Token transfers", async () => {
      await truffleAssert.reverts(
        dynaset.transferFrom(user2, admin, toWei("10"))
      );

      await dynaset.transferFrom(admin, user2, toWei("1"));
      await dynaset.approve(user2, toWei("10"));
      await dynaset.transferFrom(admin, user2, toWei("1"), { from: user2 });
    });
  });
});

// it("can swap oneIinch", async () => {
//   const rawTxOneInch = await swapFrom1nch(
//     wethmainet,
//     usdcmainet,
//     toWei("1"),
//     dynaset.address,
//     0.5, //slippage,
//     1 //chainId
//   );
//   const decode = await decodeswapFrom1nch(rawTxOneInch.tx.data);
//   console.log("decoded swap", decode);
//   await truffleAssert.passes(
//     dynaset.swapOneInch(
//       wethmainet,
//       usdcmainet,
//       toWei("100"),
//       toWei("122667.03944", "Mwei"),
//       decode.params[3],
//       {
//         from: dam,
//       }
//     )
//   );
// });

// it("can swap swapOneInchUniV3", async () => {
//   const rawTxOneInch = await swapFrom1nch(
//     wethmainet,
//     usdcmainet,
//     toWei("1"),
//     dynaset.address,
//     0.5, //slippage,
//     1 //chainId
//   );
//   console.log(rawTxOneInch);
//   const decode = await decodeswapFrom1nch(rawTxOneInch.tx.data);
//   console.log("decoded swap", decode);
//   await truffleAssert.passes(
//     dynaset.swapOneInchUniV3(
//       wethmainet,
//       usdcmainet,
//       decode.params[0].value,
//       decode.params[1].value,
//       decode.params[2].value,
//       {
//         from: dam,
//       }
//     )
//   );
// });
