const { expect } = require("chai");
const hre = require("hardhat");
const ethers = hre.ethers;

const BigNumber = require("bignumber.js");

const IERC20_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];
const UniswapV2Router_ABI = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];

// vars
const tx_options = {gasLimit:150000000, gasPrice: 50000000000};

const nothing = 0;

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";

const uniswap_v2_router = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const uniswapv2Factory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
const uniswapv3Factory = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

const chainlink_feedRegistry = "0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf";

const SHARE_PRECISION = new BigNumber("1000000000000000000").toFixed(); // 18 decimals

const uniswapRouter_address = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

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
      await hre.network.provider.request({ method: "hardhat_reset",
          params: [{ forking: { jsonRpcUrl: "https://rpc.ankr.com/eth" } }]
      });
      console.log('reset network');

      [controller, dam, _] = await ethers.getSigners();
      
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
      
      // register trace labels
      /** disabled trace labels because it conflicts with the new hardhat config extenders
      for (const token of [WETH, USDC, WBTC]) {
          const tokenContract = new ethers.Contract(token, IERC20_ABI, controller);
          hre.tracer.nameTags[token] = await tokenContract.symbol();
      }*/

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

describe("DynasetDydx Forge contract", function () {
  beforeEach(async () => {
      if (!initialized) await init();
  });
  
  describe("Deployment of DynasetDydx Forge", () => {

    it("Test Forge, withdraw and deposit by digital asset manager and redeem", async () => {
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

      // approve spending of tokens by forge
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, controller);
         await waitForTx(await tokenContract.approve(forge.address, ethers.constants.MaxUint256));
      }

      // open forge for deposits
      await waitForTx(await forge.setDeposit(true, first_forge_id));
      console.log("Forge deployed and configured: ", forge.address);

       // update oracle
       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
       
       // fast forward blockchain
       const seconds_per_block = 300;
       await ethers.provider.send("evm_increaseTime", [seconds_per_block]);
       await ethers.provider.send("evm_mine", []);

       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());

       // deposit 1 USDC in forge
       await waitForTx(await forge.deposit(first_forge_id, ONE_USDC, controller.address));
 
       // query LP balance
       const userInfo = await forge.callStatic.userInfo(first_forge_id, controller.address);
       console.log("LP balance: ", userInfo.dynasetsOwed.toString(), userInfo.depositAmount.toString());

       // start forging
       await waitForTx(await forge.startForging(first_forge_id));
       console.log("Started forging");

       // forge
       var contributorsToMint = 1;
       await waitForTx(await forge.forgeFunction(first_forge_id, contributorsToMint, nothing, tx_options));
       console.log("Forged");

       // withdraw to digital asset manager
       const usdcContract = new ethers.Contract(USDC, IERC20_ABI, dam);
       const balanceBeforeWithdraw = await usdcContract.balanceOf(dam.address); 
       await waitForTx(await dynaset.connect(dam).withdrawToDam(USDC, ONE_USDC));
       const balanceAfterWithdraw = await usdcContract.balanceOf(dam.address);
       const withdrawnByDam = balanceAfterWithdraw - balanceBeforeWithdraw;
       expect(withdrawnByDam)
           .to.be.equal(Number(ONE_USDC));

       // deposit from digital asset manager
       await waitForTx(await usdcContract.connect(dam).approve(dynaset.address, ONE_USDC));
       const balanceBeforeDeposit = await usdcContract.balanceOf(dam.address); 
       await waitForTx(await dynaset.connect(dam).depositFromDam(USDC, ONE_USDC));
       const balanceAfterDeposit = await usdcContract.balanceOf(dam.address);
       const depositedByDam = balanceBeforeDeposit - balanceAfterDeposit;
       expect(depositedByDam)
           .to.be.equal(Number(ONE_USDC));

       // Enable withdraw
       await waitForTx(await forge.setWithdraw(true, first_forge_id, tx_options));
       
       // approve dynaset shares to be spend by forge
       await waitForTx(await dynaset.approve(forge.address, ethers.constants.MaxUint256));
       
       // Redeem dynaset LP
       var userDynasetShares = await forge.getUserDynasetsOwned(first_forge_id, controller.address);
       console.log('userDynasetShares: %s', (userDynasetShares/1e18));
       var perShareUsdcValue = await dynasetOracle.dynasetUsdcValuePerShare();
       console.log('perShareUsdcValue: %s', (perShareUsdcValue/1e18));
       var usdValue = perShareUsdcValue.mul(userDynasetShares).div(SHARE_PRECISION); // 18 decimals precision
       console.log('usdValue userShares: %s', (usdValue/1e18));
       var forgeInfo = await forge.forgeInfo(first_forge_id);
       var startTime = forgeInfo[7];
       var usdValueAfterFees = await forge.capitalSlash(usdValue, startTime);
       console.log('usdValue after capital slash: %s', (usdValueAfterFees/1e18));
       var minimumAmountOut = usdValueAfterFees.mul(95).div(100).div(1e12); // account for 5% slippage and convert to 6 decimals precision for USDC
       console.log('minimumAmountOut: %s', minimumAmountOut/1e6);

       const balanceBeforeRedeem = await usdcContract.balanceOf(controller.address); 
       await waitForTx(await forge.redeem(first_forge_id, userDynasetShares, USDC, minimumAmountOut, tx_options));
       const balanceAfterRedeem = await usdcContract.balanceOf(controller.address); 
       console.log('Redeemed dynaset LP');
       const redeemed = balanceAfterRedeem-balanceBeforeRedeem;
       console.log('redeemed: %s', redeemed/1e6);
       expect(redeemed).to.be.at.least(minimumAmountOut);
    });

    it("Test unable to withdraw by digital asset manager when insufficient amount in dynaset", async () => {
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

      // approve spending of tokens by forge
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, controller);
         await waitForTx(await tokenContract.approve(forge.address, ethers.constants.MaxUint256));
      }

      // open forge for deposits
      await waitForTx(await forge.setDeposit(true, first_forge_id));
      console.log("Forge deployed and configured: ", forge.address);

       // update oracle
       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
       
       // fast forward blockchain
       const seconds_per_block = 300;
       await ethers.provider.send("evm_increaseTime", [seconds_per_block]);
       await ethers.provider.send("evm_mine", []);

       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());

       // deposit 1 USDC in forge
       await waitForTx(await forge.deposit(first_forge_id, ONE_USDC, controller.address));
 
       // query LP balance
       const userInfo = await forge.callStatic.userInfo(first_forge_id, controller.address);
       console.log("LP balance: ", userInfo.dynasetsOwed.toString(), userInfo.depositAmount.toString());

       // start forging
       await waitForTx(await forge.startForging(first_forge_id));
       console.log("Started forging");

       // forge
       var contributorsToMint = 1;
       await waitForTx(await forge.forgeFunction(first_forge_id, contributorsToMint, nothing, tx_options));
       console.log("Forged");

       // withdraw to digital asset manager
       const usdcContract = new ethers.Contract(USDC, IERC20_ABI, dam);
       const balanceBeforeWithdraw = await usdcContract.balanceOf(dam.address); 
       await expect(dynaset.connect(dam).withdrawToDam(USDC, ONE_MILLION_USDC))
           .to.be.revertedWith('ERR_INSUFFICIENT_AMOUNT');
    });

    it("Test unable to deposit by digital asset manager when insufficient amount", async () => {
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

      // approve spending of tokens by forge
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, controller);
         await waitForTx(await tokenContract.approve(forge.address, ethers.constants.MaxUint256));
      }

      // open forge for deposits
      await waitForTx(await forge.setDeposit(true, first_forge_id));
      console.log("Forge deployed and configured: ", forge.address);

       // update oracle
       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
       
       // fast forward blockchain
       const seconds_per_block = 300;
       await ethers.provider.send("evm_increaseTime", [seconds_per_block]);
       await ethers.provider.send("evm_mine", []);

       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());

       // deposit 1 USDC in forge
       await waitForTx(await forge.deposit(first_forge_id, ONE_USDC, controller.address));
 
       // query LP balance
       const userInfo = await forge.callStatic.userInfo(first_forge_id, controller.address);
       console.log("LP balance: ", userInfo.dynasetsOwed.toString(), userInfo.depositAmount.toString());

       // start forging
       await waitForTx(await forge.startForging(first_forge_id));
       console.log("Started forging");

       // forge
       var contributorsToMint = 1;
       await waitForTx(await forge.forgeFunction(first_forge_id, contributorsToMint, nothing, tx_options));
       console.log("Forged");

       // withdraw to digital asset manager
       const usdcContract = new ethers.Contract(USDC, IERC20_ABI, dam);
       const balanceBeforeWithdraw = await usdcContract.balanceOf(dam.address); 
       await waitForTx(await dynaset.connect(dam).withdrawToDam(USDC, ONE_USDC));
       const balanceAfterWithdraw = await usdcContract.balanceOf(dam.address);
       const withdrawnByDam = balanceAfterWithdraw - balanceBeforeWithdraw;
       expect(withdrawnByDam)
           .to.be.equal(Number(ONE_USDC));

       // deposit from digital asset manager
       await waitForTx(await usdcContract.connect(dam).approve(dynaset.address, ONE_USDC));
       await expect(dynaset.connect(dam).depositFromDam(USDC, ONE_MILLION_USDC))
           .to.be.revertedWith('ERR_INSUFFICIENT_AMOUNT');
    });

  });
});

