const { expect } = require("chai");
const hre = require("hardhat");
const ethers = hre.ethers;

const BigNumber = require("bignumber.js");

const IERC20_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];
const UniswapV2Router_ABI = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];

// vars
const tx_options = {gasLimit:150000000, gasPrice: 50000000000};
const nothing = 0;
const zero_address = "0x0000000000000000000000000000000000000000";

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
const SDAO = "0x993864E43Caa7F7F12953AD6fEb1d1Ca635B875F";

const SHARE_PRECISION = new BigNumber("1000000000000000000").toFixed(); // 18 decimals

const uniswapRouter_address = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const uniswapv2Factory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
const uniswapv3Factory = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

const chainlink_feedRegistry = "0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf";

const ONE_USDC = "1000000";
const HUNDRED_THOUSAND_USDC = "100000000000";
const ONE_MILLION_USDC = "1000000000000";

const maximum_observation_age = 5000000;
const slippage = 0.05;
const deadline = 13000;

const first_forge_id = 0;

async function waitForTx(tx) {
   var tx_receipt = await tx.wait();
   if (tx_receipt.status!=1) {
      console.log('\033[91m[FAILED] [TX RECEIPT] %s\033[39m', JSON.stringify(tx_receipt));
   }
   return tx_receipt;
}

async function now() {
   return Math.floor( Date.now() / 1000 );
}

async function faucet(wallet, amount) {
   const faucet_amount = ethers.utils.parseEther(amount.toString()).toHexString().replace("0x0", "0x").toString();
   await ethers.provider.send("hardhat_setBalance", [wallet, faucet_amount]);
}

var dynasetFactory_CF;
var dynaset_CF;
var dynasetTvlOracle_CF;
var forge_CF;
var uniswapRouter;

var initialized = false;

var init = async function() {
      console.log('init');
      await hre.network.provider.request({ method: "hardhat_reset",
          params: [{ forking: { jsonRpcUrl: "https://rpc.ankr.com/eth" } }]
      });
      console.log('reset network');
      [controller, dam, gnosisSafe, newGnosisSafe, _] = await ethers.getSigners();
      
      // drip gas in test account
      await faucet(controller.address, 1000);
      
      // get contract factories
      dynaset_CF = await ethers.getContractFactory("DynasetDydx");
      dynasetFactory_CF = await ethers.getContractFactory("DynasetDydxFactory");
      chainlinkOracle_CF = await ethers.getContractFactory("ChainlinkOracle");
      uniswapv3Oracle_CF = await ethers.getContractFactory("Uniswapv3Oracle");
      uniswapv2Oracle_CF = await ethers.getContractFactory("Uniswapv2Oracle");
      usdcOracle_CF = await ethers.getContractFactory("UsdcOracle");
      dynasetTvlOracle_CF = await ethers.getContractFactory("DynasetTvlOracle");
      forge_CF = await ethers.getContractFactory("ForgeV1");

      // get uniswap router
      uniswapRouter = new ethers.Contract(uniswapRouter_address, UniswapV2Router_ABI, controller);
      
      // exchange ETH for USDC
      var amountIn = new BigNumber(100e18).toFixed();
      var amountOut = (await uniswapRouter.getAmountsOut(amountIn, [WETH, USDC]))[1];
      var amountMinOut = new BigNumber(amountOut.toString()).times(1 - slippage).toFixed(0);
      var tx_deadline = (await now()) + deadline;
      await waitForTx(await uniswapRouter.swapETHForExactTokens(amountMinOut, [WETH, USDC], controller.address, tx_deadline, {...tx_options, value : amountIn}));
      console.log("Swap 100 ETH for USDC");

      // exchange ETH for WBTC
      var amountOut = (await uniswapRouter.getAmountsOut(amountIn, [WETH, WBTC]))[1];
      var amountMinOut = new BigNumber(amountOut.toString()).times(1 - slippage).toFixed(0);
      var tx_deadline = (await now()) + deadline;
      await waitForTx(await uniswapRouter.swapETHForExactTokens(amountMinOut, [WETH, WBTC], controller.address, tx_deadline, {...tx_options, value : amountIn}));
      console.log("Swap 100 ETH for WBTC");

      // exchange ETH for SDAO
      amountIn = new BigNumber(1e18).toFixed();
      var amountOut = (await uniswapRouter.getAmountsOut(amountIn, [WETH, SDAO]))[1];
      var amountMinOut = new BigNumber(amountOut.toString()).times(1 - slippage).toFixed(0);
      var tx_deadline = (await now()) + deadline;
      await waitForTx(await uniswapRouter.swapETHForExactTokens(amountMinOut, [WETH, SDAO], controller.address, tx_deadline, {...tx_options, value : amountIn}));
      console.log("Swap 1 ETH for SDAO");

      initialized = true;
}

describe("DynasetDydxFactory contract", function () {
  beforeEach(async () => {
      if (!initialized) await init();
  });
  
  describe("Deployment of DynasetDyxdxFactory", () => {


    it("When performance fee is too high, initialiseDynaset should fail", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(controller.address);
      await waitForTx(await dynasetFactory.deployDynaset(dam.address, controller.address, "Test Dynaset", "dynBTC"));
      console.log("Deployed Dynaset");
      const first_dynaset_id = 0;
      const dynasetAddress = await dynasetFactory.dynasets(first_dynaset_id);
      console.log("Dynaset: " + dynasetAddress);
      const dynaset = await dynaset_CF.connect(controller).attach(dynasetAddress);

      // deploy dynaset oracle
      const observationPeriod = 240;
      const chainlinkOracle = await chainlinkOracle_CF.deploy(chainlink_feedRegistry, USDC, WETH, WBTC);
      console.log("Deployed ChainlinkOracle");
      const usdcOracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
      console.log("Deployed UsdcOracle");
      const uniswapv3Oracle = await uniswapv3Oracle_CF.deploy(uniswapv3Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv3Oracle");
      const uniswapv2Oracle = await uniswapv2Oracle_CF.deploy(uniswapv2Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv2Oracle");
      await waitForTx(await usdcOracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
      console.log("Configured fallback oracles in UsdcOracle");
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // approve spending of tokens by dynaset
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, controller);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }
      
      // initialize dynaset
      const too_high_performance_fee = 2501;
      await expect(dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [ONE_USDC, "42000"], controller.address, too_high_performance_fee, "500"))
          .to.be.revertedWith("ERR_HIGH_PERFORMANCE_FEE");
    });

    it("When management fee is too high, initialiseDynaset should fail", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(controller.address);
      await waitForTx(await dynasetFactory.deployDynaset(dam.address, controller.address, "Test Dynaset", "dynBTC"));
      console.log("Deployed Dynaset");
      const first_dynaset_id = 0;
      const dynasetAddress = await dynasetFactory.dynasets(first_dynaset_id);
      console.log("Dynaset: " + dynasetAddress);
      const dynaset = await dynaset_CF.connect(controller).attach(dynasetAddress);

      // deploy dynaset oracle
      const observationPeriod = 240;
      const chainlinkOracle = await chainlinkOracle_CF.deploy(chainlink_feedRegistry, USDC, WETH, WBTC);
      console.log("Deployed ChainlinkOracle");
      const usdcOracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
      console.log("Deployed UsdcOracle");
      const uniswapv3Oracle = await uniswapv3Oracle_CF.deploy(uniswapv3Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv3Oracle");
      const uniswapv2Oracle = await uniswapv2Oracle_CF.deploy(uniswapv2Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv2Oracle");
      await waitForTx(await usdcOracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
      console.log("Configured fallback oracles in UsdcOracle");
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // approve spending of tokens by dynaset
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, controller);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }
      
      // initialize dynaset
      const too_high_management_fee = 501;
      await expect(dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [ONE_USDC, "42000"], controller.address, "500", too_high_management_fee))
          .to.be.revertedWith("ERR_HIGH_MANAGEMENT_FEE");
    });

    it("When dynaset is already initialised, initialiseDynaset should fail", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(controller.address);
      await waitForTx(await dynasetFactory.deployDynaset(dam.address, controller.address, "Test Dynaset", "dynBTC"));
      console.log("Deployed Dynaset");
      const first_dynaset_id = 0;
      const dynasetAddress = await dynasetFactory.dynasets(first_dynaset_id);
      console.log("Dynaset: " + dynasetAddress);
      const dynaset = await dynaset_CF.connect(controller).attach(dynasetAddress);

      // deploy dynaset oracle
      const observationPeriod = 240;
      const chainlinkOracle = await chainlinkOracle_CF.deploy(chainlink_feedRegistry, USDC, WETH, WBTC);
      console.log("Deployed ChainlinkOracle");
      const usdcOracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
      console.log("Deployed UsdcOracle");
      const uniswapv3Oracle = await uniswapv3Oracle_CF.deploy(uniswapv3Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv3Oracle");
      const uniswapv2Oracle = await uniswapv2Oracle_CF.deploy(uniswapv2Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv2Oracle");
      await waitForTx(await usdcOracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
      console.log("Configured fallback oracles in UsdcOracle");
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // approve spending of tokens by dynaset
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, controller);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [ONE_USDC, "42000"], controller.address, "500", "500"));
      await expect(dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [ONE_USDC, "42000"], controller.address, "500", "500"))
          .to.be.revertedWith("ERR_ALREADY_INITIALISED");
    });

    it("When passed a non-dynaset, initialiseDynaset should fail", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(controller.address);
      await waitForTx(await dynasetFactory.deployDynaset(dam.address, controller.address, "Test Dynaset", "dynBTC"));
      console.log("Deployed Dynaset");
      const first_dynaset_id = 0;
      const dynasetAddress = await dynasetFactory.dynasets(first_dynaset_id);
      console.log("Dynaset: " + dynasetAddress);
      const dynaset = await dynaset_CF.connect(controller).attach(dynasetAddress);

      // deploy dynaset oracle
      const observationPeriod = 240;
      const chainlinkOracle = await chainlinkOracle_CF.deploy(chainlink_feedRegistry, USDC, WETH, WBTC);
      console.log("Deployed ChainlinkOracle");
      const usdcOracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
      console.log("Deployed UsdcOracle");
      const uniswapv3Oracle = await uniswapv3Oracle_CF.deploy(uniswapv3Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv3Oracle");
      const uniswapv2Oracle = await uniswapv2Oracle_CF.deploy(uniswapv2Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv2Oracle");
      await waitForTx(await usdcOracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
      console.log("Configured fallback oracles in UsdcOracle");
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // approve spending of tokens by dynaset
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, controller);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [ONE_USDC, "42000"], controller.address, "500", "500"));
      await expect(dynasetFactory.initialiseDynaset(dynasetOracle.address, [USDC, WBTC], [ONE_USDC, "42000"], controller.address, "500", "500"))
          .to.be.revertedWith("ADDRESS_NOT_DYNASET");
    });

    it("Should not be able to assign oracle for a non-dynaset", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(controller.address);
      await waitForTx(await dynasetFactory.deployDynaset(dam.address, controller.address, "Test Dynaset", "dynBTC"));
      console.log("Deployed Dynaset");
      const first_dynaset_id = 0;
      const dynasetAddress = await dynasetFactory.dynasets(first_dynaset_id);
      console.log("Dynaset: " + dynasetAddress);
      const dynaset = await dynaset_CF.connect(controller).attach(dynasetAddress);

      // deploy dynaset oracle
      const observationPeriod = 240;
      const chainlinkOracle = await chainlinkOracle_CF.deploy(chainlink_feedRegistry, USDC, WETH, WBTC);
      console.log("Deployed ChainlinkOracle");
      const usdcOracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
      console.log("Deployed UsdcOracle");
      const uniswapv3Oracle = await uniswapv3Oracle_CF.deploy(uniswapv3Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv3Oracle");
      const uniswapv2Oracle = await uniswapv2Oracle_CF.deploy(uniswapv2Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv2Oracle");
      await waitForTx(await usdcOracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
      console.log("Configured fallback oracles in UsdcOracle");
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // approve spending of tokens by dynaset
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, controller);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [ONE_USDC, "42000"], controller.address, "500", "500"));
      
      await expect(dynasetFactory.assignTvlOracle(dynasetOracle.address, dynasetOracle.address))
          .to.be.revertedWith("ADDRESS_NOT_DYNASET");
    });

    it("Should not be able to assign tvl snapshot for a non-dynaset", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(controller.address);
      await waitForTx(await dynasetFactory.deployDynaset(dam.address, controller.address, "Test Dynaset", "dynBTC"));
      console.log("Deployed Dynaset");
      const first_dynaset_id = 0;
      const dynasetAddress = await dynasetFactory.dynasets(first_dynaset_id);
      console.log("Dynaset: " + dynasetAddress);
      const dynaset = await dynaset_CF.connect(controller).attach(dynasetAddress);

      // deploy dynaset oracle
      const observationPeriod = 240;
      const chainlinkOracle = await chainlinkOracle_CF.deploy(chainlink_feedRegistry, USDC, WETH, WBTC);
      console.log("Deployed ChainlinkOracle");
      const usdcOracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
      console.log("Deployed UsdcOracle");
      const uniswapv3Oracle = await uniswapv3Oracle_CF.deploy(uniswapv3Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv3Oracle");
      const uniswapv2Oracle = await uniswapv2Oracle_CF.deploy(uniswapv2Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv2Oracle");
      await waitForTx(await usdcOracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
      console.log("Configured fallback oracles in UsdcOracle");
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // approve spending of tokens by dynaset
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, controller);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [ONE_USDC, "42000"], controller.address, "500", "500"));
      
      await expect(dynasetFactory.assignTvlSnapshot(dynasetOracle.address))
          .to.be.revertedWith("ADDRESS_NOT_DYNASET");
    });

    it("Should not be able to collect fee for a non-dynaset", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(controller.address);
      await waitForTx(await dynasetFactory.deployDynaset(dam.address, controller.address, "Test Dynaset", "dynBTC"));
      console.log("Deployed Dynaset");
      const first_dynaset_id = 0;
      const dynasetAddress = await dynasetFactory.dynasets(first_dynaset_id);
      console.log("Dynaset: " + dynasetAddress);
      const dynaset = await dynaset_CF.connect(controller).attach(dynasetAddress);

      // deploy dynaset oracle
      const observationPeriod = 240;
      const chainlinkOracle = await chainlinkOracle_CF.deploy(chainlink_feedRegistry, USDC, WETH, WBTC);
      console.log("Deployed ChainlinkOracle");
      const usdcOracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
      console.log("Deployed UsdcOracle");
      const uniswapv3Oracle = await uniswapv3Oracle_CF.deploy(uniswapv3Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv3Oracle");
      const uniswapv2Oracle = await uniswapv2Oracle_CF.deploy(uniswapv2Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv2Oracle");
      await waitForTx(await usdcOracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
      console.log("Configured fallback oracles in UsdcOracle");
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // approve spending of tokens by dynaset
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, controller);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [ONE_USDC, "42000"], controller.address, "500", "500"));
      
      await expect(dynasetFactory.collectFee(dynasetOracle.address))
          .to.be.revertedWith("ADDRESS_NOT_DYNASET");
    });

    it("Should not be able to assignTvlSnapshot twice", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(controller.address);
      await waitForTx(await dynasetFactory.deployDynaset(dam.address, controller.address, "Test Dynaset", "dynBTC"));
      console.log("Deployed Dynaset");
      const first_dynaset_id = 0;
      const dynasetAddress = await dynasetFactory.dynasets(first_dynaset_id);
      console.log("Dynaset: " + dynasetAddress);
      const dynaset = await dynaset_CF.connect(controller).attach(dynasetAddress);

      // deploy dynaset oracle
      const observationPeriod = 240;
      const chainlinkOracle = await chainlinkOracle_CF.deploy(chainlink_feedRegistry, USDC, WETH, WBTC);
      console.log("Deployed ChainlinkOracle");
      const usdcOracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
      console.log("Deployed UsdcOracle");
      const uniswapv3Oracle = await uniswapv3Oracle_CF.deploy(uniswapv3Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv3Oracle");
      const uniswapv2Oracle = await uniswapv2Oracle_CF.deploy(uniswapv2Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv2Oracle");
      await waitForTx(await usdcOracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
      console.log("Configured fallback oracles in UsdcOracle");
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // approve spending of tokens by dynaset
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, controller);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [ONE_USDC, "42000"], controller.address, "500", "500"));

      // initialise oracle
      await waitForTx(await dynasetFactory.assignTvlOracle(dynasetAddress, dynasetOracle.address));

      // update oracle
      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
       
      // fast forward blockchain
      const seconds_per_block = 300;
      await ethers.provider.send("evm_increaseTime", [seconds_per_block]);
      await ethers.provider.send("evm_mine", []);

      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());

      // assignTvlSnapshot
      await waitForTx(await dynasetFactory.assignTvlSnapshot(dynasetAddress));
      
      await expect(dynasetFactory.assignTvlSnapshot(dynasetAddress))
          .to.be.revertedWith("ERR_SNAPSHOT_SET");
    });

    it("Should be able to fetch oracle for a certain dynaset", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(controller.address);
      await waitForTx(await dynasetFactory.deployDynaset(dam.address, controller.address, "Test Dynaset", "dynBTC"));
      console.log("Deployed Dynaset");
      const first_dynaset_id = 0;
      const dynasetAddress = await dynasetFactory.dynasets(first_dynaset_id);
      console.log("Dynaset: " + dynasetAddress);
      const dynaset = await dynaset_CF.connect(controller).attach(dynasetAddress);

      // deploy dynaset oracle
      const observationPeriod = 240;
      const chainlinkOracle = await chainlinkOracle_CF.deploy(chainlink_feedRegistry, USDC, WETH, WBTC);
      console.log("Deployed ChainlinkOracle");
      const usdcOracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
      console.log("Deployed UsdcOracle");
      const uniswapv3Oracle = await uniswapv3Oracle_CF.deploy(uniswapv3Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv3Oracle");
      const uniswapv2Oracle = await uniswapv2Oracle_CF.deploy(uniswapv2Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv2Oracle");
      await waitForTx(await usdcOracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
      console.log("Configured fallback oracles in UsdcOracle");
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // approve spending of tokens by dynaset
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, controller);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [ONE_USDC, "42000"], controller.address, "500", "500"));
      
      // initialise oracle
      await waitForTx(await dynasetFactory.assignTvlOracle(dynasetAddress, dynasetOracle.address));

      // lookup oracle
      const oracle = await dynasetFactory.getDynasetOracle(dynasetAddress);
      expect(oracle)
          .to.be.equal(dynasetOracle.address);
    });

    it("Should throw error while fetching oracle when not assigned for a certain dynaset", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(controller.address);
      await waitForTx(await dynasetFactory.deployDynaset(dam.address, controller.address, "Test Dynaset", "dynBTC"));
      console.log("Deployed Dynaset");
      const first_dynaset_id = 0;
      const dynasetAddress = await dynasetFactory.dynasets(first_dynaset_id);
      console.log("Dynaset: " + dynasetAddress);
      const dynaset = await dynaset_CF.connect(controller).attach(dynasetAddress);

      // deploy dynaset oracle
      const observationPeriod = 240;
      const chainlinkOracle = await chainlinkOracle_CF.deploy(chainlink_feedRegistry, USDC, WETH, WBTC);
      console.log("Deployed ChainlinkOracle");
      const usdcOracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
      console.log("Deployed UsdcOracle");
      const uniswapv3Oracle = await uniswapv3Oracle_CF.deploy(uniswapv3Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv3Oracle");
      const uniswapv2Oracle = await uniswapv2Oracle_CF.deploy(uniswapv2Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv2Oracle");
      await waitForTx(await usdcOracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
      console.log("Configured fallback oracles in UsdcOracle");
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // approve spending of tokens by dynaset
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, controller);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [ONE_USDC, "42000"], controller.address, "500", "500"));
      
      // lookup oracle
      await expect(dynasetFactory.getDynasetOracle(dynasetAddress))
          .to.be.revertedWith("ERR_ORACLE_UNASSIGNED");
    });

    it("Should be able to update gnosisSafe", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(gnosisSafe.address);
      expect(await dynasetFactory.gnosisSafe())
          .to.be.equal(gnosisSafe.address);
      await waitForTx(await dynasetFactory.updateGnosisSafe(newGnosisSafe.address));
      expect(await dynasetFactory.gnosisSafe())
          .to.be.equal(newGnosisSafe.address);
    });
    
    it("Should be able to assignTvlSnapshot", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(controller.address);
      await waitForTx(await dynasetFactory.deployDynaset(dam.address, controller.address, "Test Dynaset", "dynBTC"));
      console.log("Deployed Dynaset");
      const first_dynaset_id = 0;
      const dynasetAddress = await dynasetFactory.dynasets(first_dynaset_id);
      console.log("Dynaset: " + dynasetAddress);
      const dynaset = await dynaset_CF.connect(controller).attach(dynasetAddress);

      // deploy dynaset oracle
      const observationPeriod = 240;
      const chainlinkOracle = await chainlinkOracle_CF.deploy(chainlink_feedRegistry, USDC, WETH, WBTC);
      console.log("Deployed ChainlinkOracle");
      const usdcOracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
      console.log("Deployed UsdcOracle");
      const uniswapv3Oracle = await uniswapv3Oracle_CF.deploy(uniswapv3Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv3Oracle");
      const uniswapv2Oracle = await uniswapv2Oracle_CF.deploy(uniswapv2Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv2Oracle");
      await waitForTx(await usdcOracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
      console.log("Configured fallback oracles in UsdcOracle");
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // approve spending of tokens by dynaset
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, controller);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [ONE_USDC, "42000"], controller.address, "500", "500"));

      // initialise oracle
      await waitForTx(await dynasetFactory.assignTvlOracle(dynasetAddress, dynasetOracle.address));

      // update oracle
      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
       
      // fast forward blockchain
      const seconds_per_block = 300;
      await ethers.provider.send("evm_increaseTime", [seconds_per_block]);
      await ethers.provider.send("evm_mine", []);

      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());

      // assignTvlSnapshot
      await waitForTx(await dynasetFactory.assignTvlSnapshot(dynasetAddress));
    });

    it("Should throw usable price not found error when oracle price not initialized when calling assignTvlSnapshot", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(controller.address);
      await waitForTx(await dynasetFactory.deployDynaset(dam.address, controller.address, "Test Dynaset", "dynBTC"));
      console.log("Deployed Dynaset");
      const first_dynaset_id = 0;
      const dynasetAddress = await dynasetFactory.dynasets(first_dynaset_id);
      console.log("Dynaset: " + dynasetAddress);
      const dynaset = await dynaset_CF.connect(controller).attach(dynasetAddress);

      // deploy dynaset oracle
      const observationPeriod = 240;
      const chainlinkOracle = await chainlinkOracle_CF.deploy(chainlink_feedRegistry, USDC, WETH, WBTC);
      console.log("Deployed ChainlinkOracle");
      const usdcOracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
      console.log("Deployed UsdcOracle");
      const uniswapv3Oracle = await uniswapv3Oracle_CF.deploy(uniswapv3Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv3Oracle");
      const uniswapv2Oracle = await uniswapv2Oracle_CF.deploy(uniswapv2Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv2Oracle");
      await waitForTx(await usdcOracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
      console.log("Configured fallback oracles in UsdcOracle");
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // approve spending of tokens by dynaset
      for (const token of [WETH, USDC, SDAO]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, controller);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, SDAO], [ONE_USDC, "42000"], controller.address, "500", "500"));

      // initialise oracle
      await waitForTx(await dynasetFactory.assignTvlOracle(dynasetAddress, dynasetOracle.address));

      // assignTvlSnapshot
      await expect(dynasetFactory.assignTvlSnapshot(dynasetAddress))
          .to.be.revertedWith("ERR_STALE_ORACLE");
    });

    it("Should throw fee period locked error when calling collectFee immediately", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(controller.address);
      await waitForTx(await dynasetFactory.deployDynaset(dam.address, controller.address, "Test Dynaset", "dynBTC"));
      console.log("Deployed Dynaset");
      const first_dynaset_id = 0;
      const dynasetAddress = await dynasetFactory.dynasets(first_dynaset_id);
      console.log("Dynaset: " + dynasetAddress);
      const dynaset = await dynaset_CF.connect(controller).attach(dynasetAddress);

      // deploy dynaset oracle
      const observationPeriod = 240;
      const chainlinkOracle = await chainlinkOracle_CF.deploy(chainlink_feedRegistry, USDC, WETH, WBTC);
      console.log("Deployed ChainlinkOracle");
      const usdcOracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
      console.log("Deployed UsdcOracle");
      const uniswapv3Oracle = await uniswapv3Oracle_CF.deploy(uniswapv3Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv3Oracle");
      const uniswapv2Oracle = await uniswapv2Oracle_CF.deploy(uniswapv2Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv2Oracle");
      await waitForTx(await usdcOracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
      console.log("Configured fallback oracles in UsdcOracle");
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // approve spending of tokens by dynaset
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, controller);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [ONE_USDC, "42000"], controller.address, "500", "500"));

      // initialise oracle
      await waitForTx(await dynasetFactory.assignTvlOracle(dynasetAddress, dynasetOracle.address));

      // update oracle
      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
       
      // fast forward blockchain
      const seconds_per_block = 300;
      await ethers.provider.send("evm_increaseTime", [seconds_per_block]);
      await ethers.provider.send("evm_mine", []);

      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());

      // assignTvlSnapshot
      await waitForTx(await dynasetFactory.assignTvlSnapshot(dynasetAddress));
      
      // collectFee
      await expect(dynasetFactory.collectFee(dynasetAddress))
          .to.be.revertedWith("ERR_FEE_PRRIOD_LOCKED");
    });



    it("Should throw error when trying to withdraw fee amount zero", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(controller.address);

      await expect(dynasetFactory.withdrawFee(USDC, nothing))
          .to.be.revertedWith("ERR_INVALID_AMOUNT");
    });

    it("Should throw error when trying to withdraw fee too much", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(controller.address);

      await expect(dynasetFactory.withdrawFee(USDC, ONE_MILLION_USDC))
          .to.be.revertedWith("ERR_INSUFFICUENT_BALANCE");
    });

    it("Should fail when trying to set gnosisSafe to zero address", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(gnosisSafe.address);
      await expect(dynasetFactory.updateGnosisSafe(zero_address))
          .to.be.revertedWith("ERR_ZERO_ADDRESS");
    });

    it("Should not be able to initialize zero address for gnosisSafe", async () => {
        await expect(dynasetFactory_CF.deploy(zero_address))
            .to.be.revertedWith("ERR_ZERO_ADDRESS");
    });

    it("Should fail to collect fee when tvl snapshot not set", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(controller.address);
      await waitForTx(await dynasetFactory.deployDynaset(dam.address, controller.address, "Test Dynaset", "dynBTC"));
      console.log("Deployed Dynaset");
      const first_dynaset_id = 0;
      const dynasetAddress = await dynasetFactory.dynasets(first_dynaset_id);
      console.log("Dynaset: " + dynasetAddress);
      const dynaset = await dynaset_CF.connect(controller).attach(dynasetAddress);

      // deploy dynaset oracle
      const observationPeriod = 240;
      const chainlinkOracle = await chainlinkOracle_CF.deploy(chainlink_feedRegistry, USDC, WETH, WBTC);
      console.log("Deployed ChainlinkOracle");
      const usdcOracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
      console.log("Deployed UsdcOracle");
      const uniswapv3Oracle = await uniswapv3Oracle_CF.deploy(uniswapv3Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv3Oracle");
      const uniswapv2Oracle = await uniswapv2Oracle_CF.deploy(uniswapv2Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv2Oracle");
      await waitForTx(await usdcOracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
      console.log("Configured fallback oracles in UsdcOracle");
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // approve spending of tokens by dynaset
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, controller);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [ONE_USDC, "42000"], controller.address, "500", "500"));

      // initialise oracle
      await waitForTx(await dynasetFactory.assignTvlOracle(dynasetAddress, dynasetOracle.address));

      // update oracle
      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
       
      // fast forward blockchain
      var seconds_per_block = 300;
      await ethers.provider.send("evm_increaseTime", [seconds_per_block]);
      await ethers.provider.send("evm_mine", []);

      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());

      // fast forward blockchain 30 days
      seconds_per_block = 60*60*24 * 30;
      await ethers.provider.send("evm_increaseTime", [seconds_per_block]);
      await ethers.provider.send("evm_mine", []);

      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());

      var seconds_per_block = 300;
      await ethers.provider.send("evm_increaseTime", [seconds_per_block]);
      await ethers.provider.send("evm_mine", []);

      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
      
      // collectFee
      await expect(dynasetFactory.collectFee(dynasetAddress))
          .to.be.revertedWith("ERR_TVL_NOT_SET");
    });

    it("Should be able to collect and withdraw fee after 30 days", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(controller.address);
      await waitForTx(await dynasetFactory.deployDynaset(dam.address, controller.address, "Test Dynaset", "dynBTC"));
      console.log("Deployed Dynaset");
      const first_dynaset_id = 0;
      const dynasetAddress = await dynasetFactory.dynasets(first_dynaset_id);
      console.log("Dynaset: " + dynasetAddress);
      const dynaset = await dynaset_CF.connect(controller).attach(dynasetAddress);

      // deploy dynaset oracle
      const observationPeriod = 240;
      const chainlinkOracle = await chainlinkOracle_CF.deploy(chainlink_feedRegistry, USDC, WETH, WBTC);
      console.log("Deployed ChainlinkOracle");
      const usdcOracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
      console.log("Deployed UsdcOracle");
      const uniswapv3Oracle = await uniswapv3Oracle_CF.deploy(uniswapv3Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv3Oracle");
      const uniswapv2Oracle = await uniswapv2Oracle_CF.deploy(uniswapv2Factory, observationPeriod, USDC, WETH);
      console.log("Deployed Uniswapv2Oracle");
      await waitForTx(await usdcOracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
      console.log("Configured fallback oracles in UsdcOracle");
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // approve spending of tokens by dynaset
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, controller);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [ONE_USDC, "42000"], controller.address, "500", "500"));

      // initialise oracle
      await waitForTx(await dynasetFactory.assignTvlOracle(dynasetAddress, dynasetOracle.address));

      // update oracle
      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
       
      // fast forward blockchain
      var seconds_per_block = 300;
      await ethers.provider.send("evm_increaseTime", [seconds_per_block]);
      await ethers.provider.send("evm_mine", []);

      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());

      // assignTvlSnapshot
      await waitForTx(await dynasetFactory.assignTvlSnapshot(dynasetAddress));

      // fast forward blockchain 30 days
      seconds_per_block = 60*60*24 * 30;
      await ethers.provider.send("evm_increaseTime", [seconds_per_block]);
      await ethers.provider.send("evm_mine", []);

      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());

      var seconds_per_block = 300;
      await ethers.provider.send("evm_increaseTime", [seconds_per_block]);
      await ethers.provider.send("evm_mine", []);

      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
      
      // collectFee
      await waitForTx(await dynasetFactory.collectFee(dynasetAddress));
      
      // withdrawFee
      const usdcContract = new ethers.Contract(USDC, IERC20_ABI, controller);
      const controller_usdc_before = await usdcContract.balanceOf(controller.address);
      const fee = await usdcContract.balanceOf(dynasetFactory.address);
      console.log('total fee in dynasetFactory: %s', fee/1e6);
      expect(fee)
          .to.be.above(nothing);
      await waitForTx(await dynasetFactory.withdrawFee(USDC, fee));
      const feeAfterWithdraw = await usdcContract.balanceOf(dynasetFactory.address);
      console.log('total fee in dynasetFactory after withdraw: %s', feeAfterWithdraw/1e6);
      expect(feeAfterWithdraw)
          .to.be.equal(nothing);
      const controller_usdc_after = await usdcContract.balanceOf(controller.address);
      const withdrawn_amount = controller_usdc_after-controller_usdc_before;
      console.log("withdrawn_amount: %s", withdrawn_amount/1e6);
      expect(withdrawn_amount)
          .to.be.equal(fee);
    });


  });
});

