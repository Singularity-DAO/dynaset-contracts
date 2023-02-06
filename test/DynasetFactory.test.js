const truffleAssert = require("truffle-assertions");
const web3 = require("web3");
const { time } = require("@openzeppelin/test-helpers");
const { inTransaction } = require("@openzeppelin/test-helpers/src/expectEvent");
const { assertion } = require("@openzeppelin/test-helpers/src/expectRevert");
const { default: Web3 } = require("web3");
const { toWei } = web3.utils;
const { fromWei } = web3.utils;
const MAX = web3.utils.toTwosComplement(-1);
const ERC20ABI = require("../build/contracts/TToken.json").abi;

const DynasetFactory = artifacts.require("DynasetFactory");
const Dynaset = artifacts.require("Dynaset");
const TToken = artifacts.require("TToken");
const ForgeV1 = artifacts.require("ForgeV1");
const DynasetTvlOracle = artifacts.require("DynasetTvlOracle");
const Bdynaset = artifacts.require("Dynaset");
const DirectForge = artifacts.require("DirectForge");
const USDCOracle = artifacts.require("UsdcOracle");
const Uniswapv3Oracle = artifacts.require("Uniswapv3Oracle");
const ChainlinkOracle = artifacts.require("ChainlinkOracle");
const Uniswapv2Oracle = artifacts.require("Uniswapv2Oracle");

contract("Dynaset Factory", async (accounts) => {
  const admin = accounts[0];
  const gnosis = accounts[1];
  const nonAdmin = accounts[2];
  const dam = accounts[3];
  let dynasetFactory;
  let dynasetTvlOracle;
  const wethmainet = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const daimainet = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const usdcmainet = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const ntxmainnet = "0xF0d33BeDa4d734C72684b5f9abBEbf715D0a7935";
  const sdaomainnet = "0x1Bf5C3FeB4e12185b32Fcb2ccF7088147BaE21c4";
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

    dynasetFactory = await DynasetFactory.new(gnosis);
    console.log(dynasetFactory.address);

       
    const uniswapv2Factory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
    const uniswapv3Factory = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
    const chainlink_feedRegistry = "0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf";
   dynaset = await Dynaset.new(admin, dam, admin, "Dynaset weth/usd", "DYNWU");

    chainLinkOracle = await ChainlinkOracle.new(chainlink_feedRegistry,usdcmainet,wethmainet,wBtcmainNet);
    uniswapv3Oracle = await Uniswapv3Oracle.new(uniswapv3Factory, 240, usdcmainet, wethmainet);
    uniswapv2Oracle = await Uniswapv2Oracle.new(uniswapv2Factory, 240, usdcmainet, wethmainet);
    
    usdcOracle = await USDCOracle.new(chainLinkOracle.address, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48")
    await usdcOracle.setFallbackOracles([uniswapv3Oracle.address,uniswapv2Oracle.address]);
    dynasetTvlOracle = await DynasetTvlOracle.new(dynaset.address,usdcmainet, usdcOracle.address);
    

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
  });

  describe("Set up correctly", () => {
    it("has correct genosis", async () => {
      const gnosisAddress = await dynasetFactory.gnosisSafe();
      assert.equal(gnosisAddress, gnosis);
    });
  });

  describe("admin functions", () => {
    it("can deploy dynaset", async () => {
      await truffleAssert.passes(
        dynasetFactory.deployDynaset(admin, admin, "Test Dynaset", "TDS")
      );
    });

    it("can deploy multiple dynasets", async () => {
      await truffleAssert.passes(
        dynasetFactory.deployDynaset(admin, admin, "Test Dynaset-2", "TDS-2")
      );
    });

    it("only admin can deploy dynaset", async () => {
      await truffleAssert.fails(
        dynasetFactory.deployDynaset(admin, admin, "Test Dynaset", "TDS", {
          from: nonAdmin,
        })
      );
    });

    it("can initialize dynset", async () => {
      const dynaset = await dynasetFactory.dynasets("0");

      // we need to approve the dynaset for initial balance and the funds are taken from the tokenProviders account.
      await weth.methods.approve(dynaset, MAX).send({ from: admin });
      await usdc.methods.approve(dynaset, MAX).send({ from: admin });
      await dai.methods.approve(dynaset, MAX).send({ from: admin });
      await ntx.methods.approve(dynaset, MAX).send({ from: admin });

      await truffleAssert.passes(
        dynasetFactory.initialiseDynaset(
          dynaset,
          [wethmainet, daimainet, usdcmainet, ntxmainnet],
          [
            toWei("2"),
            toWei("4121"),
            toWei("4121", "Mwei"),
            toWei("10", "Mwei"),
          ],
          admin,
          1000,
          400
        )
      );
    });

    it("can not initialize twice", async () => {
      const dynaset = await dynasetFactory.dynasets("0");
      await truffleAssert.reverts(
        dynasetFactory.initialiseDynaset(
          dynaset,
          [wethmainet, daimainet, usdcmainet, ntxmainnet],
          [
            toWei("2"),
            toWei("4121"),
            toWei("4121", "Mwei"),
            toWei("10", "Mwei"),
          ],
          admin,
          1000,
          400
        )
      );
    });
  });

  describe("oracle related tests", async () => {
    it("can assign oracle", async () => {
      let dynaset = await dynasetFactory.dynasets("0");
    const uniswapv2Factory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
    const uniswapv3Factory = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
    const chainlink_feedRegistry = "0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf";

    chainLinkOracle = await ChainlinkOracle.new(chainlink_feedRegistry,usdcmainet,wethmainet,wBtcmainNet);
    uniswapv3Oracle = await Uniswapv3Oracle.new(uniswapv3Factory, 240, usdcmainet, wethmainet);
    uniswapv2Oracle = await Uniswapv2Oracle.new(uniswapv2Factory, 240, usdcmainet, wethmainet);
    
    usdcOracle = await USDCOracle.new(chainLinkOracle.address, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48")
    await usdcOracle.setFallbackOracles([uniswapv3Oracle.address,uniswapv2Oracle.address]);
    dynasetTvlOracle = await DynasetTvlOracle.new(dynaset,usdcmainet, usdcOracle.address); 
    
    
    
    await truffleAssert.passes(
        dynasetFactory.assignTvlOracle(dynaset, dynasetTvlOracle.address)
      );
    });

    it("can get the oracle address", async () => {
      let dynaset = await dynasetFactory.dynasets("0");
      const oracleAddress = await dynasetFactory.getDynasetOracle(dynaset);
      console.log("oracle address", oracleAddress);
    });

    it("only admin can assign oracle", async () => {

    let dynaset = await dynasetFactory.dynasets("0");
    const uniswapv2Factory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
    const uniswapv3Factory = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
    const chainlink_feedRegistry = "0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf";

    chainLinkOracle = await ChainlinkOracle.new(chainlink_feedRegistry,usdcmainet,wethmainet,wBtcmainNet);
    uniswapv3Oracle = await Uniswapv3Oracle.new(uniswapv3Factory, 240, usdcmainet, wethmainet);
    uniswapv2Oracle = await Uniswapv2Oracle.new(uniswapv2Factory, 240, usdcmainet, wethmainet);
    
    usdcOracle = await USDCOracle.new(chainLinkOracle.address, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48")
    await usdcOracle.setFallbackOracles([uniswapv3Oracle.address,uniswapv2Oracle.address]);
    notSetOracle = await DynasetTvlOracle.new(dynaset,usdcmainet, usdcOracle.address); 
  
      await truffleAssert.fails(
        dynasetFactory.assignTvlOracle(dynaset, notSetOracle.address,{from: nonAdmin})
      );
    });
  });

  describe("fee tests", () => {
    it("can not collect fee before seting tvl", async () => {
      await time.increase(60 * 60 * 24 * 31);
      await truffleAssert.passes(dynasetTvlOracle.updateDynasetTokenPrices());
      await time.increase(300);
      await truffleAssert.passes(dynasetTvlOracle.updateDynasetTokenPrices());

      let dynaset = await dynasetFactory.dynasets("0");
      await truffleAssert.reverts(
        dynasetFactory.collectFee(dynaset, { from: admin })
      );
    });

    it("can set dynaset tvl", async () => {
      let dynaset = await dynasetFactory.dynasets("0");
      await truffleAssert.passes(dynasetTvlOracle.updateDynasetTokenPrices());
      await time.increase(300);
      await truffleAssert.passes(dynasetTvlOracle.updateDynasetTokenPrices());

      await truffleAssert.passes(
        dynasetFactory.assignTvlSnapshot(dynaset, { from: admin })
      );
    });

    it("only admin can collect fee", async () => {
      let dynaset = await dynasetFactory.dynasets("0");
      await truffleAssert.reverts(
        dynasetFactory.assignTvlSnapshot(dynaset, { from: nonAdmin })
      );
    });

    it("can collect fee from dynaset", async () => {
      await time.increase(60 * 60 * 24 * 31);
       await truffleAssert.passes(dynasetTvlOracle.updateDynasetTokenPrices());
      await time.increase(300);
      await truffleAssert.passes(dynasetTvlOracle.updateDynasetTokenPrices());

      let dynasetTvl = await dynasetTvlOracle.dynasetTvlUsdc();
      console.log("dynaset tvl", fromWei(dynasetTvl, "Mwei"));
      let dynaset = await dynasetFactory.dynasets("0");
      await truffleAssert.passes(dynasetFactory.collectFee(dynaset));
    });

    it("can not collect fee before timelock", async () => {
      let dynaset = await dynasetFactory.dynasets("0");
      await truffleAssert.reverts(dynasetFactory.collectFee(dynaset));
    });

    it("can withdraw fee", async () => {
      let balance = await usdc.methods.balanceOf(dynasetFactory.address).call();
      console.log("balance", fromWei(balance, "Mwei"));
      await truffleAssert.passes(
        dynasetFactory.withdrawFee(usdcmainet, balance)
      );
    });
  });
});
