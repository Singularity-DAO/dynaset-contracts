const truffleAssert = require("truffle-assertions");
const web3 = require("web3");
const { time } = require("@openzeppelin/test-helpers");
const UniswapV2Factory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
const Bdynaset = artifacts.require("Dynaset");
const USDCOracle = artifacts.require("UsdcOracle");
const Uniswapv3Oracle = artifacts.require("Uniswapv3Oracle");
const ChainlinkOracle = artifacts.require("ChainlinkOracle");
const DynasetTvlOracle = artifacts.require("DynasetTvlOracle");
const Uniswapv2Oracle = artifacts.require("Uniswapv2Oracle");



contract("DynasetTvlOracle", async (accounts) => {
  const admin = accounts[0];
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
  let chainLinkOracle;
  let usdcOracle;
  let uniswapv3Oracle;
  let uniswapv2Oracle;

  before(async () => {
    const Web3 = new web3("http://127.0.0.1:8545");

    // weth = await new Web3.eth.Contract(ERC20ABI, wethmainet);
    // usdc = await new Web3.eth.Contract(ERC20ABI, usdcmainet);
    // dai = await new Web3.eth.Contract(ERC20ABI, daimainet);
    // // agix = await new Web3.eth.Contract(ERC20ABI, agixmainNet);
    // ntx = await new Web3.eth.Contract(ERC20ABI, ntxmainnet);
    // // sdao = await new Web3.eth.Contract(ERC20ABI, sdaomainnet);
    // // wbtc = await new Web3.eth.Contract(ERC20ABI, wBtcmainNet);

    wethWhale = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    usdcWhale = "0x78605Df79524164911C144801f41e9811B7DB73D";
    daiWhale = "0x7A8EDc710dDEAdDDB0B539DE83F3a306A621E823";
    ntxWhale = "0xa6958bE926d13b18eE886c5b531021fD32d4B9c4";
    sdaoWhale = "0xe92Bd58a5C0d84D4aF48D8B7d28068bcB7a92f74";
    agixWhale = "0x82019e5dC34572eF5E437a2EC06FFF31e6f8ad3C";

    const dynaset = await Bdynaset.new(
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
      await truffleAssert.passes(uniswapv2Oracle.updateTokenPrices([usdcmainet, wethmainet, ntxmainnet ,daimainet, wBtcmainNet]));
      await time.increase(300);
      await truffleAssert.passes(uniswapv2Oracle.updateTokenPrices([usdcmainet, wethmainet, ntxmainnet ,daimainet, wBtcmainNet]));

    console.log(dynasetTvlOracle.address);
  });

  describe("Oracle Tests", () => {
    it("gets correct eth value to usd", async () => {

      const tokens = "1";
      let ethTousdcValue = await dynasetTvlOracle.tokenUsdcValue(
        wethmainet,
        toWei(tokens)
      );
      console.log("ethTousdcValue", fromWei(ethTousdcValue, "Mwei"));
      // assert.notEqual(tokens.toString(), ethTousdcValue.toString());
    });

    it("gets ntx usd value", async () => {

      const tokens = "1";
      let ntxTousdcValue = await dynasetTvlOracle.tokenUsdcValue(
        ntxmainnet,
        toWei(tokens, "Mwei")
      );
      console.log("ntx usd value", fromWei(ntxTousdcValue, "Mwei"));
    });

    it("gets correct dai value to usd", async () => {
  
      const tokens = "1";
      let daiTousdcValue = await dynasetTvlOracle.tokenUsdcValue(
        daimainet,
        toWei(tokens)
      );
      console.log("dai usd value", fromWei(daiTousdcValue, "Mwei"));
    });

    it("gets correct usdc value to usd", async () => {
      const tokens = "1";
      let daiTousdcValue = await dynasetTvlOracle.tokenUsdcValue(
        usdcmainet,
        toWei(tokens, "Mwei")
      );
      console.log("usdc usd value", fromWei(daiTousdcValue, "Mwei"));
    });
  });
});
