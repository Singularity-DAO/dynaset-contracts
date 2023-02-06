const truffleAssert = require("truffle-assertions");
const web3 = require("web3");


const { time } = require("@openzeppelin/test-helpers");
const ERC20ABI = require("../build/contracts/TToken.json").abi;

const Bdynaset = artifacts.require("Dynaset");
const DirectForge = artifacts.require("DirectForge");
const USDCOracle = artifacts.require("UsdcOracle");
const Uniswapv3Oracle = artifacts.require("Uniswapv3Oracle");
const ChainlinkOracle = artifacts.require("ChainlinkOracle");
const DynasetTvlOracle = artifacts.require("DynasetTvlOracle");
const Uniswapv2Oracle = artifacts.require("Uniswapv2Oracle");

contract("DirectForge", async (accounts) => {
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
  const agixmainNet = "0x5b7533812759b45c2b44c19e320ba2cd2681b542";
  const sdaomainnet = "0x993864e43caa7f7f12953ad6feb1d1ca635b875f";
  const ntxmainnet = "0xF0d33BeDa4d734C72684b5f9abBEbf715D0a7935";
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

    chainLinkOracle = await ChainlinkOracle.new(chainlink_feedRegistry,usdcmainet,wethmainet,wBtcmainNet);
    uniswapv3Oracle = await Uniswapv3Oracle.new(uniswapv3Factory, 240, usdcmainet, wethmainet);
    uniswapv2Oracle = await Uniswapv2Oracle.new(uniswapv2Factory, 240, usdcmainet, wethmainet);
    
    usdcOracle = await USDCOracle.new(chainLinkOracle.address, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48")
    await usdcOracle.setFallbackOracles([uniswapv3Oracle.address,uniswapv2Oracle.address]);
    dynasetTvlOracle = await DynasetTvlOracle.new(dynaset.address,usdcmainet, usdcOracle.address);
    
    directForge = await DirectForge.new(
      admin,
      dynaset.address,
      dynasetTvlOracle.address
    );
   
    await ntx.methods.transfer(admin, web3.utils.toWei("15", "Mwei")).send({
      from: ntxWhale,
    });
    // await agix.methods.transfer(admin,web3.utils.toWei("10")).send({
    //   from: ntxWhale,
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
  });

  describe("configuration", () => {
    it("sets up", async () => {
      await truffleAssert.passes(
        dynaset.setMintForge(directForge.address, { from: admin })
      );
      await weth.methods.approve(dynaset.address, MAX).send({ from: admin });
      await usdc.methods.approve(dynaset.address, MAX).send({ from: admin });
      await dai.methods.approve(dynaset.address, MAX).send({ from: admin });
      await ntx.methods.approve(dynaset.address, MAX).send({ from: admin });

      await dynaset.initialize(
        [wethmainet, daimainet, usdcmainet, ntxmainnet],
        [toWei("2"), toWei("4121"), toWei("4121", "Mwei"), toWei("10", "Mwei")],
        // [toWei("25"), toWei("5"), toWei("5"), toWei("5")],
        admin
      );

      await truffleAssert.passes(uniswapv2Oracle.updateTokenPrices([usdcmainet, wethmainet, ntxmainnet ,daimainet, wBtcmainNet]));
      await time.increase(300);
      await truffleAssert.passes(uniswapv2Oracle.updateTokenPrices([usdcmainet, wethmainet, ntxmainnet ,daimainet, wBtcmainNet]));

      await truffleAssert.passes(
        dynaset.setBurnForge(directForge.address, { from: admin })
      );
    });

    it("gets correct capitalSlash", async () => {
      let currentTime = await time.latest();
      await truffleAssert.passes(directForge.setRedeemPeriod(currentTime));
      let oneDay = 60 * 60 * 24;
      days = [30, 60, 61, 100, 120, 180, 200];
      days.forEach(async (day) => {
        let capitalSlash = await directForge.capitalSlash(
          toWei("100"),
          currentTime - day * oneDay
        );
        console.log(
          `capital slash for ${day} days: ${fromWei(
            capitalSlash
          )} in direct forge`
        );
      });
    });
  });

  describe("User Interactions", () => {
    it("can instant mint usdc", async () => {
      await dynaset.setDynasetOracle(dynasetTvlOracle.address);
      const dynasetBalanceBeforeMint = await dynaset.balanceOf(admin);
      const tokenAmount = toWei("2000", "Mwei");
      await directForge.setInstantMint(true, { from: admin });

      await usdc.methods.approve(directForge.address, tokenAmount).send({
        from: admin,
      });

      const dynasetusdPrice = await dynasetTvlOracle.dynasetUsdcValuePerShare();
      const tokenUSDPrice = await usdcOracle.tokenUsdcValue(
        usdcmainet,
        toWei("1", "Mwei")
      );
      console.log("tokenUSD price", tokenUSDPrice.toString());
      const minTokensToMint =
        (dynasetusdPrice * 0.95) / (tokenUSDPrice * 10 ** (18 - 6));
      console.log("min tokens to mint", minTokensToMint);
      await truffleAssert.passes(
        directForge.instantMint(tokenAmount, usdcmainet, admin, 0, {
          from: admin,
        })
      );

      const dynasetBalanceAfterMint = await dynaset.balanceOf(admin);

      console.log(
        `dynasetBalanceBeforeMint: ${fromWei(dynasetBalanceBeforeMint)}`
      );
      console.log(
        `dynasetBalanceAfterMint: ${fromWei(dynasetBalanceAfterMint)}`
      );

      // console.log(await fromWei(dynaset.balanceOf(admin).toString()));
    });

    it("can instant mint weth", async () => {
      const dynasetBalanceBeforeMint = await dynaset.balanceOf(admin);
      const tokenAmount = toWei("2");

      await weth.methods.approve(directForge.address, tokenAmount).send({
        from: admin,
      });

      const dynasetusdPrice = await dynasetTvlOracle.dynasetUsdcValuePerShare();
      const tokenUSDPrice = await usdcOracle.tokenUsdcValue(
        wethmainet,
        toWei("1")
      );
      const minTokensToMint =
        (dynasetusdPrice * 0.95) / (tokenUSDPrice * 10 ** (18 - 6));

      await truffleAssert.passes(
        directForge.instantMint(
          tokenAmount,
          wethmainet,
          admin,
          0,
          {
            from: admin,
          }
        )
      );

      const dynasetBalanceAfterMint = await dynaset.balanceOf(admin);

      console.log(
        `dynasetBalanceBeforeMint: ${fromWei(dynasetBalanceBeforeMint)}`
      );
      console.log(
        `dynasetBalanceAfterMint: ${fromWei(dynasetBalanceAfterMint)}`
      );

      // console.log(await fromWei(dynaset.balanceOf(admin).toString()));
    });

    it("can instant mint on behalf of other users.", async () => {
      const dynasetBalanceBeforeMint = await dynaset.balanceOf(user1);
      const tokenAmount = toWei("2");

      await weth.methods.approve(directForge.address, tokenAmount).send({
        from: admin,
      });

      const dynasetusdPrice = await dynasetTvlOracle.dynasetUsdcValuePerShare();
      const tokenUSDPrice = await usdcOracle.tokenUsdcValue(
        wethmainet,
        toWei("1")
      );
      const minTokensToMint =
        (dynasetusdPrice * 0.95) / (tokenUSDPrice * 10 ** (18 - 6));

      await truffleAssert.passes(
        directForge.instantMint(
          tokenAmount,
          wethmainet,
          user1,
       0,
          {
            from: admin,
          }
        )
      );

      const dynasetBalanceAfterMint = await dynaset.balanceOf(user1);

      console.log(
        `dynasetBalanceBeforeMint: ${fromWei(dynasetBalanceBeforeMint)}`
      );
      console.log(
        `dynasetBalanceAfterMint: ${fromWei(dynasetBalanceAfterMint)}`
      );
    });

    it("it can instant redeem to eth", async () => {
      const dynasetAmount = toWei("20");
      await truffleAssert.passes(
        directForge.setInstantRedeem(true, { from: admin })
      );
      const wethBalanceBefore = await weth.methods.balanceOf(admin).call();
      console.log(`wethBalanceBefore: ${fromWei(wethBalanceBefore)}`);
      await dynaset.approve(directForge.address, dynasetAmount);
      await truffleAssert.passes(
        directForge.instantRedeem(dynasetAmount, wethmainet, 0)
      );

      const wethBalanceAfter = await weth.methods.balanceOf(admin).call();
      console.log(`wethBalanceAfter: ${fromWei(wethBalanceAfter)}`);
    });

    it("it can instant redeem to dai", async () => {
      const dynasetAmount = toWei("10");
      const daiBalanceBefore = await dai.methods.balanceOf(admin).call();
      console.log(
        `daiBalanceBefore instant redeem: ${fromWei(daiBalanceBefore)}`
      );
      await dynaset.approve(directForge.address, dynasetAmount);
      await truffleAssert.passes(
        directForge.instantRedeem(dynasetAmount, daimainet, 0)
      );

      const daiBalanceAfter = await dai.methods.balanceOf(admin).call();
      console.log(`daiBalanceAfter redeem: ${fromWei(daiBalanceAfter)}`);
    });

    it("it can instant redeem to usdc", async () => {
      const dynasetAmount = toWei("25");
      const usdcBalanceBefore = await usdc.methods.balanceOf(admin).call();
      console.log(
        `usdcBalanceBefore instant dedeem: ${fromWei(
          usdcBalanceBefore,
          "Mwei"
        )}`
      );
      await dynaset.approve(directForge.address, dynasetAmount, {
        from: admin,
      });
      await truffleAssert.passes(
        directForge.instantRedeem(dynasetAmount, usdcmainet, 0, { from: admin })
      );
      const usdcBalanceAfter = await usdc.methods.balanceOf(admin).call();
      console.log(
        `usdcBalanceAfter instant redeem: ${fromWei(usdcBalanceAfter, "Mwei")}`
      );
    });
    it("it can instant redeem to ntx", async () => {
      const dynasetAmount = toWei("10");
      const usdcBalanceBefore = await ntx.methods.balanceOf(admin).call();
      console.log(
        `ntx balance before instant dedeem: ${fromWei(
          usdcBalanceBefore,
          "Mwei"
        )}`
      );
      await dynaset.approve(directForge.address, dynasetAmount, {
        from: admin,
      });
      await truffleAssert.passes(
        directForge.instantRedeem(dynasetAmount, ntxmainnet, 0, { from: admin })
      );
      const usdcBalanceAfter = await ntx.methods.balanceOf(admin).call();
      console.log(
        `ntx balance after instant redeem: ${fromWei(usdcBalanceAfter, "Mwei")}`
      );
    });
  });

  describe("Admin Functions", () => {
    it("can withdraw fee from DirectForge", async () => {
      const adminBalanceBefore = await dynaset.balanceOf(admin);
      console.log(
        `adminBalanceBefore withdrawFeeInDirectForge: ${fromWei(
          adminBalanceBefore
        )}`
      );
      await truffleAssert.passes(directForge.withdrawFee());
      const adminBalanceAfter = await dynaset.balanceOf(admin);
      console.log(
        `adminBalanceAfter withdrawFeeInDirectForge: ${fromWei(
          adminBalanceAfter
        )}`
      );
      assert.isTrue(adminBalanceAfter > adminBalanceBefore);
    });
  });
});
