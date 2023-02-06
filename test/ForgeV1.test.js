const truffleAssert = require("truffle-assertions");
const web3 = require("web3");
const oneinch = require("../OneInchApi/oneinchApi");

const ForgeFactory = artifacts.require("ForgeV1");
//const ForgeCoins = artifacts.require('DynasetForgeCoins');
const TToken = artifacts.require("TToken");
//const BFactory = artifacts.require('BFactory');
const verbose = process.env.VERBOSE;
const { time } = require("@openzeppelin/test-helpers");
const ERC20ABI = require("../build/contracts/TToken.json").abi;
//const ForgeCoins = artifacts.require('DynasetForgeCoins');
const Bdynaset = artifacts.require("Dynaset");
const DirectForge = artifacts.require("DirectForge");
const USDCOracle = artifacts.require("UsdcOracle");
const Uniswapv3Oracle = artifacts.require("Uniswapv3Oracle");
const ChainlinkOracle = artifacts.require("ChainlinkOracle");
const DynasetTvlOracle = artifacts.require("DynasetTvlOracle");
const Uniswapv2Oracle = artifacts.require("Uniswapv2Oracle");


contract("DynasetForgev1", async (accounts) => {
  const admin = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  const user3 = accounts[3];
  const user4 = accounts[4];
  const user5 = accounts[5];
  const user6 = accounts[6];

  const { toWei } = web3.utils;
  const { fromWei } = web3.utils;
  const errorDelta = 10 ** -8;
  const MAX = web3.utils.toTwosComplement(-1);

  const wethmainet = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const daimainet = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const usdcmainet = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const wBtcmainNet = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599";
  // const agixmainNet = "0x5b7533812759b45c2b44c19e320ba2cd2681b542";
  // const sdaomainnet = "0x993864e43caa7f7f12953ad6feb1d1ca635b875f";
  const ntxmainnet = "0xF0d33BeDa4d734C72684b5f9abBEbf715D0a7935";

  let WETH;
  let USDC;
  let DAI;
  let AGIX;
  let NTX;
  let SDAO;
  let XXX; // addresses
  let weth;
  let usdc;
  let dai;
  let agix;
  let ntx;
  let sdao;
  let xsdao; // TTokens
  let forge; // first forge w/ defaults
  let forgecoins; // first forge w/ defaults
  let FORGE; //   forge address
  let FORGECOINS; //   forge address
  let DYN;

  let dynasetTvlOracle;
  let dynaset;
  let chainLinkOracle;
  let usdcOracle;
  let uniswapv3Oracle;
  let uniswapv2Oracle;

  before(async () => {
    const Web3 = new web3("http://127.0.0.1:8545");

    weth = await new Web3.eth.Contract(ERC20ABI, wethmainet);
    usdc = await new Web3.eth.Contract(ERC20ABI, usdcmainet);
    dai = await new Web3.eth.Contract(ERC20ABI, daimainet);
    ntx = await new Web3.eth.Contract(ERC20ABI, ntxmainnet);

    wethWhale = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    usdcWhale = "0x78605Df79524164911C144801f41e9811B7DB73D";
    daiWhale = "0x7A8EDc710dDEAdDDB0B539DE83F3a306A621E823";
    ntxWhale = "0xa6958bE926d13b18eE886c5b531021fD32d4B9c4";
    sdaoWhale = "0xe92Bd58a5C0d84D4aF48D8B7d28068bcB7a92f74";
    agixWhale = "0x82019e5dC34572eF5E437a2EC06FFF31e6f8ad3C";

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
    console.log(
      "weth balance for admin",
      await weth.methods.balanceOf(admin).call()
    );
    console.log(
      "usdc balance for admin",
      toWei(await usdc.methods.balanceOf(admin).call(), "Mwei")
    );
    console.log(
      "dai balance for admin",
      toWei(await dai.methods.balanceOf(admin).call())
    );
    console.log(
      "ntx balance for admin",
      toWei(await usdc.methods.balanceOf(admin).call(), "Mwei")
    );

    dynaset = await Bdynaset.new(
      admin,
      admin,
      admin,
      "Dynaset weth/usd",
      "DYNWU"
    );

    const uniswapv2Factory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
    const uniswapv3Factory = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
    const chainlink_feedRegistry = "0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf";

    chainLinkOracle = await ChainlinkOracle.new(chainlink_feedRegistry, usdcmainet, wethmainet, wBtcmainNet);
    uniswapv3Oracle = await Uniswapv3Oracle.new(uniswapv3Factory, 240, usdcmainet, wethmainet);
    uniswapv2Oracle = await Uniswapv2Oracle.new(uniswapv2Factory, 240, usdcmainet, wethmainet);

    usdcOracle = await USDCOracle.new(chainLinkOracle.address, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48")
    await usdcOracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]);
    dynasetTvlOracle = await DynasetTvlOracle.new(dynaset.address, usdcmainet, usdcOracle.address);

    DYN = dynaset.address;
    directForge = await DirectForge.new(
      admin,
      dynaset.address,
      dynasetTvlOracle.address
    );
    forgecoins = await ForgeFactory.new(
      admin,
      dynaset.address,
      dynasetTvlOracle.address
    );

    console.log("forgecoins", forgecoins.address);
    console.log("dynaset", dynaset.address);
  });

  describe("env is setup", () => {
    it("should have the correct balances", async () => {
      assert.isTrue((await weth.methods.balanceOf(admin).call()) >= 10);
      assert.isTrue((await usdc.methods.balanceOf(admin).call()) >= 5000);
      assert.isTrue((await dai.methods.balanceOf(admin).call()) >= 5000);
    });
  });
  // setup uniswap to have full test cases

  // there tests will be moved to seperate file. but we need the chnges in contracts
  // for other tests in the file so we have not removed it entirly.
  describe("Setup Dynaset", () => {
    it("is deployed Correctly", async () => {
      const name = await dynaset.name();
      assert.equal("Dynaset weth/usd", name);
    });

    it("Admin approves tokens", async () => {
      await weth.methods.approve(DYN, MAX).send({ from: admin });
      await usdc.methods.approve(DYN, MAX).send({ from: admin });
      await dai.methods.approve(DYN, MAX).send({ from: admin });
      await ntx.methods.approve(DYN, MAX).send({ from: admin });
    });

    it("initialise Dynaset", async () => {
      await dynaset.initialize(
        [usdcmainet, wethmainet, daimainet, ntxmainnet],
        [toWei("4121", "Mwei"), toWei("2"), toWei("4121"), toWei("10", "Mwei")],
        // [toWei("25"), toWei("5"), toWei("5"), toWei("5")],
        admin
      );

      await truffleAssert.passes(
        dynaset.setMintForge(forgecoins.address, { from: admin })
      );

      await truffleAssert.passes(
        dynaset.setMintForge(directForge.address, { from: admin })
      );

      const numTokens = await dynaset.getNumTokens();

      const totalSupply = await dynaset.totalSupply();
      console.log("totalSupply", totalSupply);

      assert.equal(4, numTokens);
    });

    it("can update oracle prices for all tokens", async () => {
      await truffleAssert.passes(dynasetTvlOracle.updateDynasetTokenPrices());
      await time.increase(300);
      await truffleAssert.passes(dynasetTvlOracle.updateDynasetTokenPrices());

    });

    it("gets DynasetTvlUsdc", async () => {
      const dynasetTvlUsdc = await dynasetTvlOracle.dynasetTvlUsdc();
      console.log(`dynaset tvl usdc: ${fromWei(dynasetTvlUsdc, "Mwei")}`);
    });

    it("has correect balance", async () => {
      const balance = await dynaset.balanceOf(admin);
      assert.equal(toWei("100"), balance);
    });

    it("Get underlying tokens for 100 dynaset convert to eth value", async () => {
      const { tokens, amounts } = await dynaset.calcTokensForAmount(
        toWei("100")
      );
      const currentTokens = await dynaset.getCurrentTokens();
      assert.equal(tokens.length, currentTokens.length);
      assert.equal(amounts.length, currentTokens.length);
    });
  });

  describe("BLACK_SMITH functionality", () => {
    it(" user approve tokens", async () => {
      // await weth.approve(POOL, MAX, { from: user1 });
      // await usdc.approve(POOL, MAX, { from: user1 });
      await dai.methods.approve(forgecoins.address, MAX).send({ from: user1 });
      await dai.methods.approve(forgecoins.address, MAX).send({ from: user2 });
      await dai.methods.approve(forgecoins.address, MAX).send({ from: user3 });
      await dai.methods.approve(forgecoins.address, MAX).send({ from: user4 });
      // await xxx.approve(POOL, MAX, { from: user1 });

      await weth.methods.approve(forgecoins.address, MAX).send({ from: user1 });
      await usdc.methods.approve(forgecoins.address, MAX).send({ from: user1 });
      // await dai.approve(forgecoins.address, MAX, { from: user1 });
      // await xxx.approve(POOL, MAX, { from: user2 });
    });

    it("creates eth forge", async () => {
      await truffleAssert.passes(
        forgecoins.createForge(
          true,
          wethmainet,
          toWei("1"),
          toWei("100"),
          toWei("100000"),
          { from: admin }
        )
      );

      // these are tests for other dynaset contracts but as they are required
      // for other tests not removed them.
      await truffleAssert.passes(
        dynaset.setBurnForge(forgecoins.address, { from: admin })
      );
      await truffleAssert.passes(
        dynaset.setBurnForge(directForge.address, { from: admin })
      );
    });

    it("only blacksmith can create eth  forge", async () => {
      await truffleAssert.reverts(
        forgecoins.createForge(
          true,
          wethmainet,
          toWei("0.1"),
          toWei("100"),
          toWei("100000"),
          { from: user1 }
        )
      );
    });
  });

  describe("User interactions", () => {
    it("can not deposit before deposit is enabled", async () => {
      await truffleAssert.reverts(
        forgecoins.deposit(0, 10, user1, { from: user1, value: 10 })
      );

      await truffleAssert.reverts(
        forgecoins.deposit(1, 10, user1, { from: user1 })
      );
    });

    it("blacksmith can enable deposit", async () => {
      await truffleAssert.passes(forgecoins.setDeposit(true, 0));
    });

    it("other users can not enable deposit", async () => {
      await truffleAssert.reverts(
        forgecoins.setDeposit(true, 0, { from: user1 })
      );
    });

    it("can not enable deposit for non existant forge", async () => {
      await truffleAssert.reverts(forgecoins.setDeposit(true, 10));
    });

    it("deposits amount to eth  forge", async () => {
      let forgeId = 0;
      let depositAmount = toWei("10");
      await truffleAssert.passes(
        forgecoins.deposit(forgeId, depositAmount, user1, {
          from: user1,
          value: depositAmount,
        })
      );

      await truffleAssert.passes(
        forgecoins.deposit(forgeId, depositAmount, user2, {
          from: user2,
          value: depositAmount,
        })
      );

      await truffleAssert.passes(
        forgecoins.deposit(forgeId, depositAmount, admin, {
          from: admin,
          value: depositAmount,
        })
      );
      let userConftibution = await forgecoins.getUserContribution(
        forgeId,
        user1
      );
      assert.equal(userConftibution, depositAmount);

      const totalContributionUSDC = await forgecoins.calculateContributionUsdc(
        forgeId
      );
      console.log(`totalContributionUSDC: ${totalContributionUSDC}`);
      assert.notEqual(
        totalContributionUSDC.toString(),
        depositAmount.toString()
      );
    });

    it("can deposit on behalf of other user", async () => {
      let forgeId = 0;
      let depositAmount = toWei("10");
      let userConftibutionBefore = await forgecoins.getUserContribution(
        forgeId,
        user4
      );
      await truffleAssert.passes(
        forgecoins.deposit(forgeId, depositAmount, user4, {
          from: admin,
          value: depositAmount,
        })
      );
      let userConftibutionAfter = await forgecoins.getUserContribution(
        forgeId,
        user4
      );
      assert.equal(
        userConftibutionAfter - userConftibutionBefore,
        depositAmount
      );

      const totalContributionUSDC = await forgecoins.calculateContributionUsdc(
        forgeId
      );
      console.log(`totalContributionUSDC: ${totalContributionUSDC}`);
    });

    it("gets dynaset usd value per share", async () => {
      const dynasetUsdValuePerShare = await dynasetTvlOracle.dynasetUsdcValuePerShare();
      console.log(`dynaset usd value per share: ${dynasetUsdValuePerShare}`);
    });

    it("gets correct forge output amount", async () => {
      const outputAmount = await forgecoins.getOutputAmount(0);
      console.log(JSON.stringify(outputAmount));

      console.log(`outputAmount: ${fromWei(outputAmount)}`);

      let tokens = await dynaset.calcTokensForAmount(outputAmount);
      tokens["amounts"].forEach((e) => {
        console.log(fromWei(e));
      });
      console.log(`tokens: ${JSON.stringify(tokens)}`);
      assert.isTrue(outputAmount > 0);
    });

    it("can not forge", async () => {
      await truffleAssert.reverts(
        forgecoins.forgeFunction(0, 10, 0, { from: user1 })
      );
    });

    it("can not forge before forging is started", async () => {
      await truffleAssert.fails(forgecoins.forgeFunction(0, 2, 0));
    });

    it("only admin can start forging", async () => {
      await truffleAssert.reverts(forgecoins.startForging(0, { from: user2 }));
    });

    it("admin can start forging", async () => {
      await truffleAssert.passes(forgecoins.startForging(0, { from: admin }));
    });

    it("can not deposit once forging is started", async () => {
      await truffleAssert.reverts(
        forgecoins.deposit(0, toWei("1"), admin, {
          from: admin,
          value: toWei("1"),
        })
      );
    });

    it("can forge ethForge with  all depositors at once ", async () => {
      const forgeId = 0;

      await dynaset.setDynasetOracle(dynasetTvlOracle.address);
      let forgeBalance = await forgecoins.getForgeBalance(forgeId);

      let outputAmount = await forgecoins.getOutputAmount(forgeId);
      console.log("output amount for forge", fromWei(outputAmount));

      let balanceBeforeForge = await weth.methods
        .balanceOf(forgecoins.address)
        .call();
      console.log(
        `forgecoins balance before: ${fromWei(
          balanceBeforeForge
        )} for forge ${forgeId}`
      );

      console.log(`forgeBalance: ${forgeBalance.toString()}`);

      console.log(await dynaset.calcTokensForAmount(toWei("1")));
      let totalSupplyBeforeJoin = await dynaset.totalSupply();

      await truffleAssert.passes(
        forgecoins.forgeFunction(forgeId, 5, 0, {
          from: admin,
        })
      );

      let totalSupplyAfterJoin = await dynaset.totalSupply();

      let balanceAfterForge = await weth.methods
        .balanceOf(forgecoins.address)
        .call();
      console.log(
        `forgecoins balance after: ${fromWei(
          balanceAfterForge
        )} for forge ${forgeId}`
      );
      assert.isTrue(Number(balanceAfterForge) < Number(balanceBeforeForge));
    });

    it("checks balances after forge for forge function", async () => {
      let wethBalance = await weth.methods.balanceOf(forgecoins.address).call();
      console.log(`wethBalance: ${fromWei(wethBalance)}`);
      let usdcBalance = await usdc.methods.balanceOf(forgecoins.address).call();
      console.log(`usdcBalance: ${fromWei(usdcBalance, "Mwei")}`);
      let daiBalance = await dai.methods.balanceOf(forgecoins.address).call();
      console.log(`daiBalance: ${fromWei(daiBalance)}`);
      let ntxBalance = await ntx.methods.balanceOf(forgecoins.address).call();
      console.log(`ntxBalance: ${fromWei(ntxBalance, "Mwei")}`);
    });

    it("checks balances after forge for dynaset", async () => {
      let wethBalance = await weth.methods.balanceOf(dynaset.address).call();
      console.log(`dynaset wethBalance: ${fromWei(wethBalance)}`);
      let usdcBalance = await usdc.methods.balanceOf(dynaset.address).call();
      console.log(`dynaset usdcBalance: ${fromWei(usdcBalance, "Mwei")}`);
      let daiBalance = await dai.methods.balanceOf(dynaset.address).call();
      console.log(`dynaset daiBalance: ${fromWei(daiBalance)}`);
    });

    it("GET FORGE Dynaset balance", async () => {
      const forgeDynasetBalance = await dynaset.balanceOf(forgecoins.address);
      console.log(`forgeDynasetBalance: ${forgeDynasetBalance}`);
    });

    it("can redeem to eth", async () => {
      const wethBalanceBefore = await weth.methods.balanceOf(user1).call();
      console.log(`wethBalanceBefore: ${fromWei(wethBalanceBefore)}`);
      const dynasetBalanceBefore = await dynaset.balanceOf(forgecoins.address);
      console.log(`dynasetBalanceBefore: ${fromWei(dynasetBalanceBefore)}`);
      await truffleAssert.passes(forgecoins.setWithdraw(true, 0));

      // const amountToWithdraw = (
      //   await forgecoins.userInfo(0, user1)
      // ).dynasetsOwed.toString();
      const amountToWithdraw = toWei("1");
      // console.log("Amount to withdraw", amountToWithdraw.toString());
      // const res = await forgecoins.redeem(0, amountToWithdraw, wethmainet, {
      //   from: user1,
      // });

      // get min amount of tokenOut for amountToWithdraw dynasets.
      const dynasetusdPrice = await dynasetTvlOracle.dynasetUsdcValuePerShare();

      const tokenUSDPrice = await dynasetTvlOracle.tokenUsdcValue(
        wethmainet,
        toWei("1")
      );

      const minTokensOutForRedeem =
        (dynasetusdPrice * 0.8) / (tokenUSDPrice * 10 ** (18 - 6));
      console.log("min amount out for redeem ", minTokensOutForRedeem);

      await truffleAssert.passes(
        forgecoins.redeem(
          0,
          amountToWithdraw,
          wethmainet,
          toWei(minTokensOutForRedeem.toFixed(2).toString()),
          {
            from: user1,
          }
        )
      );

      const wethBalance = await weth.methods.balanceOf(user1).call();
      console.log(`wethBalance: ${fromWei(wethBalance)}`);
      const dynasetBalance = await dynaset.balanceOf(forgecoins.address);
      console.log(`dynasetBalanceAfterRedeem: ${fromWei(dynasetBalance)}`);
      if (wethBalance > wethBalanceBefore) {
        assert.isTrue(true);
      }
    });

    it("can redeem to usdc", async () => {
      const wethBalanceBefore = await weth.methods.balanceOf(user1).call();
      console.log(`wethBalanceBefore: ${fromWei(wethBalanceBefore)}`);
      const dynasetBalanceBefore = await dynaset.balanceOf(forgecoins.address);
      console.log(`dynasetBalanceBefore: ${fromWei(dynasetBalanceBefore)}`);
      await truffleAssert.passes(forgecoins.setWithdraw(true, 0));

      const amountToWithdraw = toWei("100");
      // const amountToWithdraw = (await forgecoins.userInfo(0, user1)).dynasetsOwed;

      const dynasetusdPrice = await dynasetTvlOracle.dynasetUsdcValuePerShare();

      const tokenUSDPrice = await dynasetTvlOracle.tokenUsdcValue(
        usdcmainet,
        toWei("1", "Mwei")
      );

      let minTokensOutForRedeem =
        (fromWei(amountToWithdraw) * (dynasetusdPrice * 0.94)) /
        (tokenUSDPrice * 10 ** (18 - 6));

      console.log("min amount out for usdc redeem ", minTokensOutForRedeem);
      await truffleAssert.passes(
        forgecoins.redeem(
          0,
          amountToWithdraw,
          usdcmainet,
          toWei(minTokensOutForRedeem.toFixed(2).toString(), "Mwei"),
          {
            from: user1,
          }
        )
      );

      const wethBalance = await weth.methods.balanceOf(user1).call();
      console.log(`wethBalance: ${fromWei(wethBalance)}`);
      const dynasetBalance = await dynaset.balanceOf(forgecoins.address);
      console.log(`dynasetBalanceAfterRedeem: ${fromWei(dynasetBalance)}`);
    });

    it("gets correct capitalSlash", async () => {
      let currentTime = await time.latest();
      let oneDay = 60 * 60 * 24;
      days = [30, 60, 61, 100, 120, 180, 200];
      days.forEach(async (day) => {
        let capitalSlash = await forgecoins.capitalSlash(
          toWei("100"),
          currentTime - day * oneDay
        );
        console.log(`capital slash for ${day} days: ${fromWei(capitalSlash)}`);
      });
    });

    it("can withdraw fee from Forge", async () => {
      const adminBalanceBefore = await dynaset.balanceOf(admin);
      console.log(`adminBalanceBefore: ${fromWei(adminBalanceBefore)}`);
      await truffleAssert.passes(forgecoins.withdrawFee());
      const adminBalanceAfter = await dynaset.balanceOf(admin);
      console.log(`adminBalanceAfter: ${fromWei(adminBalanceAfter)}`);
    });

    it("can update the oracle", async () => {

      const uniswapv2Factory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
      const uniswapv3Factory = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
      const chainlink_feedRegistry = "0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf";

      chainLinkOracle = await ChainlinkOracle.new(chainlink_feedRegistry, usdcmainet, wethmainet, wBtcmainNet);
      uniswapv3Oracle = await Uniswapv3Oracle.new(uniswapv3Factory, 240, usdcmainet, wethmainet);
      uniswapv2Oracle = await Uniswapv2Oracle.new(uniswapv2Factory, 240, usdcmainet, wethmainet);

      usdcOracle = await USDCOracle.new(chainLinkOracle.address, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48")
      await usdcOracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]);
      let newDynasetOracle = await DynasetTvlOracle.new(dynaset.address, usdcmainet, usdcOracle.address);


      await truffleAssert.passes(
        forgecoins.updateOracle(newDynasetOracle.address)
      );
    });
  });

  describe("usdc token forge", () => {
    it("creates token forge", async () => {
      await truffleAssert.passes(
        forgecoins.createForge(
          false,
          usdcmainet,
          toWei("1", "Mwei"),
          toWei("100", "Mwei"),
          toWei("1000000", "Mwei"),
          {
            from: admin,
          }
        )
      );
    });

    it("blacksmith can enable deposit", async () => {
      await truffleAssert.passes(forgecoins.setDeposit(true, 1));
    });

    it("deposits amount to token forge", async () => {
      // users would need usdc before they can deposit.
      let forgeId = 1;
      let depositAmount = toWei("100", "Mwei");
      [user1, user2, user3].forEach(async (user) => {
        await usdc.methods
          .transfer(user, web3.utils.toWei("500", "Mwei"))
          .send({ from: usdcWhale });
      });
      await truffleAssert.passes(
        usdc.methods
          .approve(forgecoins.address, toWei("100.1", "Mwei"))
          .send({ from: admin })
      );

      await truffleAssert.passes(
        forgecoins.deposit(forgeId, depositAmount, admin, {
          from: admin,
        })
      );
    });

    it("admin can start forging", async () => {
      await truffleAssert.passes(forgecoins.startForging(1, { from: admin }));
    });
  });
});
