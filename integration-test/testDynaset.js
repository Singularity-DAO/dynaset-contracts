const { expect } = require("chai");
const hre = require("hardhat");
const ethers = hre.ethers;

const BigNumber = require("bignumber.js");

const IERC20_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];
const UniswapV2Router_ABI = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];

// vars
const tx_options = {gasLimit:150000000, gasPrice: 90000000000};

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";

const uniswap_v2_router = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const sushiswap_v2_router = "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F";
const uniswapv2Factory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
const uniswapv3Factory = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

const chainlink_feedRegistry = "0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf";

const SHARE_PRECISION = new BigNumber("1000000000000000000").toFixed(); // 18 decimals

const uniswapRouter_address = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

const ONE_USDC = "1000000";
const FIFTY_USDC = "50000000";
const HUNDRED_USDC = "100000000";
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
   return (await ethers.provider.getBlock("latest")).timestamp;
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

      [controller, dam, _] = await ethers.getSigners();
      
      // drip gas in test account
      await faucet(controller.address, 1000);
      
      // get contract factories
      dynaset_CF = await ethers.getContractFactory("Dynaset");
      dynasetFactory_CF = await ethers.getContractFactory("DynasetFactory");
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

      initialized = true;
}

describe("Dynaset Forge contract", function () {
  beforeEach(async () => {
      if (!initialized) await init();
  });
  
  describe("Deployment of Dynaset Forge", () => {

    it("Test upgrade uniswap v2 router", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(controller.address);
      await waitForTx(await dynasetFactory.deployDynaset(dam.address, controller.address, "Test Dynaset", "dynBTC"));
      console.log("Deployed Dynaset");
      const first_dynaset_id = 0;
      const dynasetAddress = await dynasetFactory.dynasets(first_dynaset_id);
      console.log("Dynaset: " + dynasetAddress);

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
      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
      console.log("Initialized dynaset");

      // deploy forge
      const forge = await forge_CF.deploy(controller.address, dynasetAddress, dynasetOracle.address);
      await waitForTx(await forge.createForge(false, USDC, ONE_USDC, HUNDRED_THOUSAND_USDC, ONE_MILLION_USDC));
      await waitForTx(await forge.setDeadline(deadline));

      // configure dynaset for forge and oracle
      const dynaset = await dynaset_CF.connect(controller).attach(dynasetAddress);
      await waitForTx(await dynaset.setMintForge(forge.address));
      await waitForTx(await dynaset.setBurnForge(forge.address));
      await waitForTx(await dynasetFactory.assignTvlOracle(dynaset.address, dynasetOracle.address));
      
      // expect default to be uniswap v2 router
      const current_router = await dynaset.uniswapV2Router();
      expect(current_router)
          .to.be.equal(uniswap_v2_router);
            
      // should update to sushiswap
      await dynaset.connect(controller).upgradeUniswapV2Router(sushiswap_v2_router);
      const new_router = await dynaset.uniswapV2Router();
      expect(new_router)
          .to.be.equal(sushiswap_v2_router);

    });

    it("Test dynaset swap using uniswap v2", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(controller.address);
      await waitForTx(await dynasetFactory.deployDynaset(dam.address, controller.address, "Test Dynaset", "dynBTC"));
      console.log("Deployed Dynaset");
      const first_dynaset_id = 0;
      const dynasetAddress = await dynasetFactory.dynasets(first_dynaset_id);
      console.log("Dynaset: " + dynasetAddress);

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

      // calculate 50 USDC worth of WBTC
      const usdc_wbtc_amounts = await uniswapRouter.getAmountsOut(FIFTY_USDC, [USDC, WBTC]);
      const wbtc_amount = usdc_wbtc_amounts[1];
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [FIFTY_USDC, wbtc_amount], controller.address, "500", "500"));
      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
      console.log("Initialized dynaset");

      // deploy forge
      const forge = await forge_CF.deploy(controller.address, dynasetAddress, dynasetOracle.address);
      await waitForTx(await forge.createForge(false, USDC, ONE_USDC, HUNDRED_THOUSAND_USDC, ONE_MILLION_USDC));
      await waitForTx(await forge.setDeadline(deadline));

      // configure dynaset for forge and oracle
      const dynaset = await dynaset_CF.connect(controller).attach(dynasetAddress);
      await waitForTx(await dynaset.setMintForge(forge.address));
      await waitForTx(await dynaset.setBurnForge(forge.address));
      await waitForTx(await dynasetFactory.assignTvlOracle(dynaset.address, dynasetOracle.address));
      
      // check dynaset balances
      const before = await dynaset.getTokenAmounts();
      console.log('Dynaset token #0 (%s) before swap: %s', before[0][0], before[1][0]);
      console.log('Dynaset token #1 (%s) before swap: %s', before[0][1], before[1][1]);
      
      // should swap using uniswap v2
      const tokenIn = USDC;
      const tokenOut = WBTC;
      const amountIn = ONE_USDC;
      const amountOutMin = 0;
      console.log('amountIn: %s', amountIn);
      console.log('amountOutMin: %s', amountOutMin);
      await waitForTx(await dynaset.connect(dam).swapUniswap(tokenIn, tokenOut, amountIn, amountOutMin));

      // check dynaset balances
      const after = await dynaset.getTokenAmounts();
      console.log('Dynaset token #0 (%s) after swap: %s', after[0][0], after[1][0]);
      console.log('Dynaset token #1 (%s) after swap: %s', after[0][1], after[1][1]);
      
      expect(after[1][0])
          .to.be.below(before[1][0]);
      expect(after[1][1])
          .to.be.above(before[1][1]);
      expect(before[1][0] - after[1][0])
          .to.be.equal(amountIn*1);
      
    });

    it("Test dynaset swap using uniswap v3 at 1inch", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(controller.address);
      await waitForTx(await dynasetFactory.deployDynaset(dam.address, controller.address, "Test Dynaset", "dynBTC"));
      console.log("Deployed Dynaset");
      const first_dynaset_id = 0;
      const dynasetAddress = await dynasetFactory.dynasets(first_dynaset_id);
      console.log("Dynaset: " + dynasetAddress);

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

      // calculate 50 USDC worth of WBTC
      const usdc_wbtc_amounts = await uniswapRouter.getAmountsOut(FIFTY_USDC, [USDC, WBTC]);
      const wbtc_amount = usdc_wbtc_amounts[1];
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [FIFTY_USDC, wbtc_amount], controller.address, "500", "500"));
      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
      console.log("Initialized dynaset");

      // deploy forge
      const forge = await forge_CF.deploy(controller.address, dynasetAddress, dynasetOracle.address);
      await waitForTx(await forge.createForge(false, USDC, ONE_USDC, HUNDRED_THOUSAND_USDC, ONE_MILLION_USDC));
      await waitForTx(await forge.setDeadline(deadline));

      // configure dynaset for forge and oracle
      const dynaset = await dynaset_CF.connect(controller).attach(dynasetAddress);
      await waitForTx(await dynaset.setMintForge(forge.address));
      await waitForTx(await dynaset.setBurnForge(forge.address));
      await waitForTx(await dynasetFactory.assignTvlOracle(dynaset.address, dynasetOracle.address));
      
      // check dynaset balances
      const before = await dynaset.getTokenAmounts();
      console.log('Dynaset token #0 (%s) before swap: %s', before[0][0], before[1][0]);
      console.log('Dynaset token #1 (%s) before swap: %s', before[0][1], before[1][1]);
      
      // should swap using uniswap v3
      const WBTC_USDC_3000_UNISWAP_V3_LP = "0x99ac8ca7087fa4a2a1fb6357269965a2014abc35";
      const REVERSE_MASK = "0x800000000000000000000000";
      const USDC_WBTC_3000_POOL = REVERSE_MASK + WBTC_USDC_3000_UNISWAP_V3_LP.slice(2);
      const tokenIn = USDC;
      const tokenOut = WBTC;
      const amountIn = ONE_USDC;
      const amountOutMin = 0;
      console.log('amountIn: %s %s', amountIn, tokenIn);
      console.log('amountOutMin: %s %s', amountOutMin, tokenOut);
      await waitForTx(await dynaset.connect(dam).swapOneInchUniV3(tokenIn, tokenOut, amountIn, amountOutMin, [USDC_WBTC_3000_POOL]));

      // check dynaset balances
      const after = await dynaset.getTokenAmounts();
      console.log('Dynaset token #0 (%s) after swap: %s', after[0][0], after[1][0]);
      console.log('Dynaset token #1 (%s) after swap: %s', after[0][1], after[1][1]);
      
      expect(after[1][0])
          .to.be.below(before[1][0]);
      expect(after[1][1])
          .to.be.above(before[1][1]);
      expect(before[1][0] - after[1][0])
          .to.be.equal(amountIn*1);
      
    });

    it("Test dynaset swap using unoswap at 1inch", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(controller.address);
      await waitForTx(await dynasetFactory.deployDynaset(dam.address, controller.address, "Test Dynaset", "dynBTC"));
      console.log("Deployed Dynaset");
      const first_dynaset_id = 0;
      const dynasetAddress = await dynasetFactory.dynasets(first_dynaset_id);
      console.log("Dynaset: " + dynasetAddress);

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

      // calculate 50 USDC worth of WBTC
      const usdc_wbtc_amounts = await uniswapRouter.getAmountsOut(FIFTY_USDC, [USDC, WBTC]);
      const wbtc_amount = usdc_wbtc_amounts[1];
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [FIFTY_USDC, wbtc_amount], controller.address, "500", "500"));
      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
      console.log("Initialized dynaset");

      // deploy forge
      const forge = await forge_CF.deploy(controller.address, dynasetAddress, dynasetOracle.address);
      await waitForTx(await forge.createForge(false, USDC, ONE_USDC, HUNDRED_THOUSAND_USDC, ONE_MILLION_USDC));
      await waitForTx(await forge.setDeadline(deadline));

      // configure dynaset for forge and oracle
      const dynaset = await dynaset_CF.connect(controller).attach(dynasetAddress);
      await waitForTx(await dynaset.setMintForge(forge.address));
      await waitForTx(await dynaset.setBurnForge(forge.address));
      await waitForTx(await dynasetFactory.assignTvlOracle(dynaset.address, dynasetOracle.address));
      
      // check dynaset balances
      const before = await dynaset.getTokenAmounts();
      console.log('Dynaset token #0 (%s) before swap: %s', before[0][0], before[1][0]);
      console.log('Dynaset token #1 (%s) before swap: %s', before[0][1], before[1][1]);
      
      // should swap using unoswap
      const WBTC_USDC_LUASWAP_LP = "0x66e10dea0019dc7353d2e4106e9b84f1cfc17cba";
      const LUASWAP_NUMERATOR = "0x3b5dc100";
      const REVERSE_MASK = "0x8000000000000000";
      const USDC_WBTC_POOL = REVERSE_MASK + LUASWAP_NUMERATOR.slice(2) + WBTC_USDC_LUASWAP_LP.slice(2); // "0x80000000000000003b5dc10066e10dea0019dc7353d2e4106e9b84f1cfc17cba"
      const tokenIn = USDC;
      const tokenOut = WBTC;
      const amountIn = ONE_USDC;
      const amountOutMin = 0;
      console.log('amountIn: %s', amountIn);
      console.log('amountOutMin: %s', amountOutMin);
      await waitForTx(await dynaset.connect(dam).swapOneInch(tokenIn, tokenOut, amountIn, amountOutMin, [USDC_WBTC_POOL]));

      // check dynaset balances
      const after = await dynaset.getTokenAmounts();
      console.log('Dynaset token #0 (%s) after swap: %s', after[0][0], after[1][0]);
      console.log('Dynaset token #1 (%s) after swap: %s', after[0][1], after[1][1]);
      
      expect(after[1][0])
          .to.be.below(before[1][0]);
      expect(after[1][1])
          .to.be.above(before[1][1]);
      expect(before[1][0] - after[1][0])
          .to.be.equal(amountIn*1);
      
    });


  });
});

