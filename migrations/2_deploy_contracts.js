require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
let Web3 = require("web3");

let Forge = artifacts.require("./ForgeV1.sol");
let DynasetTvlOracle = artifacts.require("./DynasetTvlOracle.sol");
let DirectForge = artifacts.require("./DirectForge");
let Dynaset = artifacts.require("./Dynaset");
let ChainlinkOracle = artifacts.require("./ChainlinkOracle");
let UsdcOracle = artifacts.require("./UsdcOracle");
let Uniswapv3Oracle = artifacts.require("./Uniswapv3Oracle");
module.exports = async function (deployer, network, accounts) {
  const observationPeriod = 240; // 2 min;
  const wethmainet = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const usdcmainet = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const wBtcmainNet = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599";

  const uniswapv3Factory = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
  const chainlink_feedRegistry = "0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf";
  await deployer.deploy(
      Dynaset,
      accounts[0],
      accounts[0],
      accounts[0],
      "Dynaset weth/usd",
      "DYNWU"
    )

  await deployer.deploy(ChainlinkOracle, chainlink_feedRegistry, usdcmainet,wethmainet,wBtcmainNet);
  await deployer.deploy(Uniswapv3Oracle, uniswapv3Factory, observationPeriod, usdcmainet, wethmainet);
  await deployer.deploy(UsdcOracle, ChainlinkOracle.address, usdcmainet);
  await deployer.deploy(DynasetTvlOracle,Dynaset.address,usdcmainet ,UsdcOracle.address);

};
