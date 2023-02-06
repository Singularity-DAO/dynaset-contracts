const { expect } = require("chai");
const hre = require("hardhat");
const ethers = hre.ethers;

const BigNumber = require("bignumber.js");

const IERC20_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];
const UniswapV2Router_ABI = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];

// vars
const tx_options = {gasLimit:150000000, gasPrice: 50000000000};

const zero_address = "0x0000000000000000000000000000000000000000";
const nothing = 0;

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";

const uniswap_v2_router = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const sushiswap_v2_router = "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F";
const uniswapv2Factory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
const uniswapv3Factory = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
const chainlink_feedRegistry = "0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf";

const DYNASET_PRECISION = new BigNumber("1000000000000000000").toFixed(); // 18 decimals

const uniswapRouter_address = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

const HALF_USDC = "500000";
const ONE_USDC = "1000000";
const HUNDRED_THOUSAND_USDC = "100000000000";
const ONE_MILLION_USDC = "1000000000000";
const TEN_MILLION_USDC = "10000000000000";
const ONE_BILLION_USDC = "1000000000000000";

const SMALL_WBTC_AMOUNT = "42000";
const SMALL_WETH_AMOUNT = "10000000000000000";

const maximum_observation_age = 5000000;
const slippage = 0.05;
const deadline = 13000;

const days = 60*60*24;

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

const impersonateSigner = async (provider, impersonate_wallet) => {
    await provider.send("hardhat_impersonateAccount",[impersonate_wallet]);
    const impersonate_signer = await provider.getSigner(impersonate_wallet);
    return impersonate_signer;
}

const useWhaleFunds = async (provider, wallet, token, amount, to) => {
    const whale_signer = await impersonateSigner(account.provider, wallet);
    const tokenContract = new ethers.Contract(token, IERC20_ABI, whale_signer);
    const decimals = await tokenContract.decimals();
    const symbol = await tokenContract.symbol();
    await faucet(wallet, 1000000000000000);
    await waitForTx(await tokenContract.transfer(to, amount));
    console.log('use %s %s from whale %s for tests', amount/(10**decimals), symbol, wallet);
}

const useTenMillionUsdWorthOfWhaleFunds = async (account, wallet, token) => {
    let amount = TEN_MILLION_USDC;
    if (token != USDC) {
       const path = (token != WETH) ? [USDC, WETH, token] : [USDC, WETH];
       const usdc_token_amounts = await uniswapRouter.getAmountsOut(amount, path);
       amount = usdc_token_amounts[(token != WETH)?2:1];
    }
    await useWhaleFunds(account.provider, wallet, token, amount, account.address);
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
      [account, unprivileged_account, _] = await ethers.getSigners();
      console.log('got signers');
      
      // drip gas in test account 
      await faucet(account.address, 100000);
      console.log('got gas');
      
      // get contract factories
      dynaset_CF = await ethers.getContractFactory("Dynaset");
      dynasetFactory_CF = await ethers.getContractFactory("DynasetFactory");
      chainlinkOracle_CF = await ethers.getContractFactory("ChainlinkOracle");
      uniswapv3Oracle_CF = await ethers.getContractFactory("Uniswapv3Oracle");
      uniswapv2Oracle_CF = await ethers.getContractFactory("Uniswapv2Oracle");
      usdcOracle_CF = await ethers.getContractFactory("UsdcOracle");
      dynasetTvlOracle_CF = await ethers.getContractFactory("DynasetTvlOracle");
      forge_CF = await ethers.getContractFactory("DirectForge");
      console.log('got factories');

      // get uniswap router
      uniswapRouter = new ethers.Contract(uniswapRouter_address, UniswapV2Router_ABI, account);

      // use assets from whales for test to not move uniswap LP prices
      await useTenMillionUsdWorthOfWhaleFunds(account, "0x0a59649758aa4d66e25f08dd01271e891fe52199", USDC);
      await useTenMillionUsdWorthOfWhaleFunds(account, "0x9ff58f4ffb29fa2266ab25e75e2a8b3503311656", WBTC);
      await useTenMillionUsdWorthOfWhaleFunds(account, "0xf04a5cc80b1e94c69b48f5ee68a08cd2f09a7c3e", WETH);

      initialized = true;
}

describe("DirectForge contract", function () {
  beforeEach(async () => {
      if (!initialized) await init();
  });
  
  describe("Deployment of DirectForge", () => {

    it("Test instantMint USDC and instantRedeem USDC", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(account.address);
      await waitForTx(await dynasetFactory.deployDynaset(account.address, account.address, "Test Dynaset", "dynBTC"));
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
         const tokenContract = new ethers.Contract(token, IERC20_ABI, account);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }

      // calculate 0.5 USDC worth of WBTC
      const usdc_wbtc_amounts = await uniswapRouter.getAmountsOut(HALF_USDC, [USDC, WBTC]);
      const wbtc_amount = usdc_wbtc_amounts[1];
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [HALF_USDC, wbtc_amount], account.address, "500", "500"));
      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
      console.log("Initialized dynaset");

      // deploy forge
      const forge = await forge_CF.deploy(account.address, dynasetAddress, dynasetOracle.address);

      // configure dynaset for forge and oracle
      const dynaset = await dynaset_CF.connect(account).attach(dynasetAddress);
      await waitForTx(await dynaset.setMintForge(forge.address));
      await waitForTx(await dynaset.setBurnForge(forge.address));
      await waitForTx(await dynasetFactory.assignTvlOracle(dynaset.address, dynasetOracle.address));
      await waitForTx(await dynaset.setDeadline(deadline));

      // approve spending of tokens by forge
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, account);
         await waitForTx(await tokenContract.approve(forge.address, ethers.constants.MaxUint256));
      }

       // update oracle
       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
       
       // fast forward blockchain
       const seconds_per_block = 300;
       await ethers.provider.send("evm_increaseTime", [seconds_per_block]);
       await ethers.provider.send("evm_mine", []);

       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());

       // enable instantMint
       await waitForTx(await forge.setInstantMint(true));

       var perShareUsdcValue = await dynasetOracle.dynasetUsdcValuePerShare();
       console.log('perShareUsdcValue: %s', (perShareUsdcValue/1e18));
       const expectedShares = ethers.BigNumber.from(ONE_USDC).mul(ethers.BigNumber.from(1e12)).mul(DYNASET_PRECISION).div(perShareUsdcValue);
       console.log('expectedShares: %s', expectedShares/1e18);
       var minimumAmountOut = expectedShares.mul(97).div(100);
       console.log('minimumAmountOut: %s', minimumAmountOut/1e18);

       // query LP balance
       const userDynasetSharesBeforeMint = await dynaset.balanceOf(account.address);
       console.log("LP balance (before mint): %s", userDynasetSharesBeforeMint/1e18);

       // instant mint 1 USDC in forge
       await waitForTx(await forge.instantMint(ONE_USDC, USDC, account.address, minimumAmountOut));
 
       // query LP balance
       const userDynasetSharesAfterMint = await dynaset.balanceOf(account.address);
       console.log("LP balance (after mint): %s", userDynasetSharesAfterMint/1e18);
       const userDynasetShares = userDynasetSharesAfterMint.sub(userDynasetSharesBeforeMint);
       console.log("LP balance minted: %s", userDynasetShares/1e18);

       // enable instantRedeem
       await waitForTx(await forge.setInstantRedeem(true));
       
       // approve dynaset shares to be spend by forge
       await waitForTx(await dynaset.approve(forge.address, ethers.constants.MaxUint256));
       
       // Redeem dynaset LP
       var perShareUsdcValue = await dynasetOracle.dynasetUsdcValuePerShare();
       console.log('perShareUsdcValue: %s', (perShareUsdcValue/1e18));
       usdValue = perShareUsdcValue.mul(userDynasetShares).div(DYNASET_PRECISION); // 18 decimals precision
       console.log('usdValue userShares: %s', (usdValue/1e18));
       var contribPeriodInstantRedeem = await forge.contribPeriodInstantRedeem();
       console.log('contribPeriodInstantRedeem: %s', contribPeriodInstantRedeem);
       var usdValueAfterFees = await forge.capitalSlash(usdValue, contribPeriodInstantRedeem);
       console.log('usdValue after capital slash: %s', (usdValueAfterFees/1e18));
       minimumAmountOut = usdValueAfterFees.mul(99).div(100).div(1e12); // account for 1% slippage and convert to 6 decimals precision for USDC
       console.log('minimumAmountOut: %s', minimumAmountOut/1e6);

       const usdcContract = new ethers.Contract(USDC, IERC20_ABI, account);
       const balanceBeforeRedeem = await usdcContract.balanceOf(account.address); 
       await waitForTx(await forge.instantRedeem(userDynasetShares, USDC, minimumAmountOut, tx_options));
       const balanceAfterRedeem = await usdcContract.balanceOf(account.address);
       console.log('Redeemed dynaset LP');
       const redeemed = balanceAfterRedeem-balanceBeforeRedeem;
       console.log('redeemed: %s', redeemed/1e6);
       expect(redeemed).to.be.at.least(minimumAmountOut);
       
       perShareUsdcValue = await dynasetOracle.dynasetUsdcValuePerShare();
       console.log('perShareUsdcValue: %s', (perShareUsdcValue/1e18));
    });

    it("Test instantMint WBTC and instantRedeem WBTC", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(account.address);
      await waitForTx(await dynasetFactory.deployDynaset(account.address, account.address, "Test Dynaset", "dynBTC"));
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
         const tokenContract = new ethers.Contract(token, IERC20_ABI, account);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [ONE_USDC, SMALL_WBTC_AMOUNT], account.address, "500", "500"));
      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
      console.log("Initialized dynaset");

      // deploy forge
      const forge = await forge_CF.deploy(account.address, dynasetAddress, dynasetOracle.address);
      await waitForTx(await forge.setDeadline(deadline));

      // configure dynaset for forge and oracle
      const dynaset = await dynaset_CF.connect(account).attach(dynasetAddress);
      await waitForTx(await dynaset.setMintForge(forge.address));
      await waitForTx(await dynaset.setBurnForge(forge.address));
      await waitForTx(await dynasetFactory.assignTvlOracle(dynaset.address, dynasetOracle.address));
      await waitForTx(await dynaset.setDeadline(deadline));

      // approve spending of tokens by forge
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, account);
         await waitForTx(await tokenContract.approve(forge.address, ethers.constants.MaxUint256));
      }

       // update oracle
       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
       
       // fast forward blockchain
       const seconds_per_block = 300;
       await ethers.provider.send("evm_increaseTime", [seconds_per_block]);
       await ethers.provider.send("evm_mine", []);

       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());

       // enable instantMint
       await waitForTx(await forge.setInstantMint(true));

       // query LP balance
       const userDynasetSharesBeforeMint = await dynaset.balanceOf(account.address);
       console.log("LP balance (before mint): %s", userDynasetSharesBeforeMint/1e18);

       // instant mint small WBTC amount in forge
       await waitForTx(await forge.instantMint(SMALL_WBTC_AMOUNT, WBTC, account.address, nothing));
 
       const userDynasetSharesAfterMint = await dynaset.balanceOf(account.address);
       console.log("LP balance (after mint): %s", userDynasetSharesAfterMint/1e18);
       const userDynasetShares = userDynasetSharesAfterMint.sub(userDynasetSharesBeforeMint);
       console.log("LP balance minted: %s", userDynasetShares/1e18);

       // enable instantRedeem
       await waitForTx(await forge.setInstantRedeem(true));
       
       // approve dynaset shares to be spend by forge
       await waitForTx(await dynaset.approve(forge.address, ethers.constants.MaxUint256));
       
       // Redeem dynaset LP
       const wbtcContract = new ethers.Contract(WBTC, IERC20_ABI, account);
       const balanceBeforeRedeem = await wbtcContract.balanceOf(account.address); 
       await waitForTx(await forge.instantRedeem(userDynasetShares, WBTC, nothing, tx_options));
       const balanceAfterRedeem = await wbtcContract.balanceOf(account.address); 
       console.log('Redeemed dynaset LP');
       const redeemed = balanceAfterRedeem-balanceBeforeRedeem;
       console.log('redeemed: %s', redeemed/1e8);
       expect(redeemed).to.be.above(nothing);
    });

    it("Test instantMint WETH and instantRedeem WETH", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(account.address);
      await waitForTx(await dynasetFactory.deployDynaset(account.address, account.address, "Test Dynaset", "dynBTC"));
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

      // approve usdc to router
      const usdcContract = new ethers.Contract(USDC, IERC20_ABI, account);
      await waitForTx(await usdcContract.approve(uniswapRouter_address, ethers.constants.MaxUint256));

      // approve spending of tokens by dynaset
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, account);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [ONE_USDC, SMALL_WBTC_AMOUNT], account.address, "500", "500"));
      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
      console.log("Initialized dynaset");

      // deploy forge
      const forge = await forge_CF.deploy(account.address, dynasetAddress, dynasetOracle.address);
      await waitForTx(await forge.setDeadline(deadline));

      // configure dynaset for forge and oracle
      const dynaset = await dynaset_CF.connect(account).attach(dynasetAddress);
      await waitForTx(await dynaset.setMintForge(forge.address));
      await waitForTx(await dynaset.setBurnForge(forge.address));
      await waitForTx(await dynasetFactory.assignTvlOracle(dynaset.address, dynasetOracle.address));
      await waitForTx(await dynaset.setDeadline(deadline));

      // approve spending of tokens by forge
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, account);
         await waitForTx(await tokenContract.approve(forge.address, ethers.constants.MaxUint256));
         const decimals = await tokenContract.decimals();
         console.log('token: %s decimals: %s balance: %s', token, decimals, (await tokenContract.balanceOf(account.address))/(10**decimals));
      }

       // update oracle
       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
       
       // fast forward blockchain
       const seconds_per_block = 300;
       await ethers.provider.send("evm_increaseTime", [seconds_per_block]);
       await ethers.provider.send("evm_mine", []);

       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());

       // enable instantMint
       await waitForTx(await forge.setInstantMint(true));

       // query LP balance
       const userDynasetSharesBeforeMint = await dynaset.balanceOf(account.address);
       console.log("LP balance (before mint): %s", userDynasetSharesBeforeMint/1e18);

       // instant mint small WBTC amount in forge
       console.log('before instantMint %s WETH', SMALL_WETH_AMOUNT/1e18);
       await waitForTx(await forge.instantMint(SMALL_WETH_AMOUNT, WETH, account.address, nothing));
 
       // query LP balance
       const userDynasetSharesAfterMint = await dynaset.balanceOf(account.address);
       console.log("LP balance (after mint): %s", userDynasetSharesAfterMint/1e18);
       const userDynasetShares = userDynasetSharesAfterMint.sub(userDynasetSharesBeforeMint);
       console.log("LP balance minted: %s", userDynasetShares/1e18);

       // enable instantRedeem
       await waitForTx(await forge.setInstantRedeem(true));
       
       // approve dynaset shares to be spend by forge
       await waitForTx(await dynaset.approve(forge.address, ethers.constants.MaxUint256));
       
       // Redeem dynaset LP
       const wethContract = new ethers.Contract(WETH, IERC20_ABI, account);
       const balanceBeforeRedeem = await wethContract.balanceOf(account.address); 
       await waitForTx(await forge.instantRedeem(userDynasetShares, WETH, nothing, tx_options));
       const balanceAfterRedeem = await wethContract.balanceOf(account.address); 
       console.log('Redeemed dynaset LP');
       const redeemed = balanceAfterRedeem-balanceBeforeRedeem;
       console.log('redeemed: %s', redeemed/1e18);
       expect(redeemed).to.be.above(nothing);
    });

    it("Test instantMint should not be allowed when not enabled", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(account.address);
      await waitForTx(await dynasetFactory.deployDynaset(account.address, account.address, "Test Dynaset", "dynBTC"));
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
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // approve spending of tokens by dynaset
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, account);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [ONE_USDC, SMALL_WBTC_AMOUNT], account.address, "500", "500"));
      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
      console.log("Initialized dynaset");

      // deploy forge
      const forge = await forge_CF.deploy(account.address, dynasetAddress, dynasetOracle.address);
      await waitForTx(await forge.setDeadline(deadline));

      // configure dynaset for forge and oracle
      const dynaset = await dynaset_CF.connect(account).attach(dynasetAddress);
      await waitForTx(await dynaset.setMintForge(forge.address));
      await waitForTx(await dynaset.setBurnForge(forge.address));
      await waitForTx(await dynasetFactory.assignTvlOracle(dynaset.address, dynasetOracle.address));
      await waitForTx(await dynaset.setDeadline(deadline));

      // approve spending of tokens by forge
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, account);
         await waitForTx(await tokenContract.approve(forge.address, ethers.constants.MaxUint256));
      }

       // update oracle
       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
       
       // fast forward blockchain
       const seconds_per_block = 300;
       await ethers.provider.send("evm_increaseTime", [seconds_per_block]);
       await ethers.provider.send("evm_mine", []);

       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());

       // disable instantMint
       await waitForTx(await forge.setInstantMint(false));

       // instant mint 1 USDC in forge
       await expect(forge.instantMint(ONE_USDC, USDC, account.address, nothing))
           .to.be.revertedWith('ERR_DIRECTMINT_DISABLED');
    });

    it("Test instantMint should not be allowed for zero address", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(account.address);
      await waitForTx(await dynasetFactory.deployDynaset(account.address, account.address, "Test Dynaset", "dynBTC"));
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
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // approve spending of tokens by dynaset
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, account);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [ONE_USDC, SMALL_WBTC_AMOUNT], account.address, "500", "500"));
      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
      console.log("Initialized dynaset");

      // deploy forge
      const forge = await forge_CF.deploy(account.address, dynasetAddress, dynasetOracle.address);
      await waitForTx(await forge.setDeadline(deadline));

      // configure dynaset for forge and oracle
      const dynaset = await dynaset_CF.connect(account).attach(dynasetAddress);
      await waitForTx(await dynaset.setMintForge(forge.address));
      await waitForTx(await dynaset.setBurnForge(forge.address));
      await waitForTx(await dynasetFactory.assignTvlOracle(dynaset.address, dynasetOracle.address));
      await waitForTx(await dynaset.setDeadline(deadline));

      // approve spending of tokens by forge
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, account);
         await waitForTx(await tokenContract.approve(forge.address, ethers.constants.MaxUint256));
      }

       // update oracle
       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
       
       // fast forward blockchain
       const seconds_per_block = 300;
       await ethers.provider.send("evm_increaseTime", [seconds_per_block]);
       await ethers.provider.send("evm_mine", []);

       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());

       // enable instantMint
       await waitForTx(await forge.setInstantMint(true));

       // instant mint 1 USDC in forge to zero address
       await expect(forge.instantMint(ONE_USDC, USDC, zero_address, nothing))
           .to.be.revertedWith('ERR_ZERO_ADDRESS');
    });

    it("Test instantMint should not be allowed for zero amount", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(account.address);
      await waitForTx(await dynasetFactory.deployDynaset(account.address, account.address, "Test Dynaset", "dynBTC"));
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
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // approve spending of tokens by dynaset
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, account);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [ONE_USDC, SMALL_WBTC_AMOUNT], account.address, "500", "500"));
      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
      console.log("Initialized dynaset");

      // deploy forge
      const forge = await forge_CF.deploy(account.address, dynasetAddress, dynasetOracle.address);
      await waitForTx(await forge.setDeadline(deadline));

      // configure dynaset for forge and oracle
      const dynaset = await dynaset_CF.connect(account).attach(dynasetAddress);
      await waitForTx(await dynaset.setMintForge(forge.address));
      await waitForTx(await dynaset.setBurnForge(forge.address));
      await waitForTx(await dynasetFactory.assignTvlOracle(dynaset.address, dynasetOracle.address));
      await waitForTx(await dynaset.setDeadline(deadline));

      // approve spending of tokens by forge
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, account);
         await waitForTx(await tokenContract.approve(forge.address, ethers.constants.MaxUint256));
      }

       // update oracle
       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
       
       // fast forward blockchain
       const seconds_per_block = 300;
       await ethers.provider.send("evm_increaseTime", [seconds_per_block]);
       await ethers.provider.send("evm_mine", []);

       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());

       // enable instantMint
       await waitForTx(await forge.setInstantMint(true));

       // instant mint 0 USDC in forge
       await expect(forge.instantMint(nothing, USDC, account.address, nothing))
           .to.be.revertedWith('ERR_ZERO_AMOUNT');
    });

    it("Test instantMint should fail when not enough funds available", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(account.address);
      await waitForTx(await dynasetFactory.deployDynaset(account.address, account.address, "Test Dynaset", "dynBTC"));
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
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // approve spending of tokens by dynaset
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, account);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [ONE_USDC, SMALL_WBTC_AMOUNT], account.address, "500", "500"));
      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
      console.log("Initialized dynaset");

      // deploy forge
      const forge = await forge_CF.deploy(account.address, dynasetAddress, dynasetOracle.address);
      await waitForTx(await forge.setDeadline(deadline));

      // configure dynaset for forge and oracle
      const dynaset = await dynaset_CF.connect(account).attach(dynasetAddress);
      await waitForTx(await dynaset.setMintForge(forge.address));
      await waitForTx(await dynaset.setBurnForge(forge.address));
      await waitForTx(await dynasetFactory.assignTvlOracle(dynaset.address, dynasetOracle.address));
      await waitForTx(await dynaset.setDeadline(deadline));

      // approve spending of tokens by forge
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, account);
         await waitForTx(await tokenContract.approve(forge.address, ethers.constants.MaxUint256));
      }

       // update oracle
       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
       
       // fast forward blockchain
       const seconds_per_block = 300;
       await ethers.provider.send("evm_increaseTime", [seconds_per_block]);
       await ethers.provider.send("evm_mine", []);

       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());

       // enable instantMint
       await waitForTx(await forge.setInstantMint(true));

       // instant mint 1 billion USDC in forge
       await expect(forge.instantMint(ONE_BILLION_USDC, USDC, account.address, nothing))
           .to.be.revertedWith('NOT_ENOUGH_FUNDS');
    });

    it("Test instantRedeem should not be allowed when disabled", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(account.address);
      await waitForTx(await dynasetFactory.deployDynaset(account.address, account.address, "Test Dynaset", "dynBTC"));
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
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // approve spending of tokens by dynaset
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, account);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [ONE_USDC, SMALL_WBTC_AMOUNT], account.address, "500", "500"));
      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
      console.log("Initialized dynaset");

      // deploy forge
      const forge = await forge_CF.deploy(account.address, dynasetAddress, dynasetOracle.address);
      await waitForTx(await forge.setDeadline(deadline));

      // configure dynaset for forge and oracle
      const dynaset = await dynaset_CF.connect(account).attach(dynasetAddress);
      await waitForTx(await dynaset.setMintForge(forge.address));
      await waitForTx(await dynaset.setBurnForge(forge.address));
      await waitForTx(await dynasetFactory.assignTvlOracle(dynaset.address, dynasetOracle.address));
      await waitForTx(await dynaset.setDeadline(deadline));

      // approve spending of tokens by forge
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, account);
         await waitForTx(await tokenContract.approve(forge.address, ethers.constants.MaxUint256));
      }

       // update oracle
       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
       
       // fast forward blockchain
       const seconds_per_block = 300;
       await ethers.provider.send("evm_increaseTime", [seconds_per_block]);
       await ethers.provider.send("evm_mine", []);

       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());

       // enable instantMint
       await waitForTx(await forge.setInstantMint(true));

       // instant mint 1 USDC in forge
       await waitForTx(await forge.instantMint(ONE_USDC, USDC, account.address, nothing));
 
       // query LP balance
       const userDynasetShares = await dynaset.balanceOf(account.address);
       console.log("LP balance: %s", userDynasetShares/1e18);

       // approve dynaset shares to be spend by forge
       await waitForTx(await dynaset.approve(forge.address, ethers.constants.MaxUint256));

       // disable instantRedeem
       await waitForTx(await forge.setInstantRedeem(false));
              
       // Redeem dynaset LP
       var perShareUsdcValue = await dynasetOracle.dynasetUsdcValuePerShare();
       console.log('perShareUsdcValue: %s', (perShareUsdcValue/1e18));
       var usdValue = perShareUsdcValue.mul(userDynasetShares).div(DYNASET_PRECISION); // 18 decimals precision
       console.log('usdValue userShares: %s', (usdValue/1e18));
       var contribPeriodInstantRedeem = await forge.contribPeriodInstantRedeem();
       console.log('contribPeriodInstantRedeem: %s', contribPeriodInstantRedeem);
       var usdValueAfterFees = await forge.capitalSlash(usdValue, contribPeriodInstantRedeem);
       console.log('usdValue after capital slash: %s', (usdValueAfterFees/1e18));
       var minimumAmountOut = usdValueAfterFees.mul(99).div(100).div(1e12); // account for 1% slippage and convert to 6 decimals precision for USDC
       console.log('minimumAmountOut: %s', minimumAmountOut/1e6);

       await expect(forge.instantRedeem(userDynasetShares, USDC, minimumAmountOut, tx_options))
           .to.be.revertedWith('ERR_INSTANTREDEEM_DISABLED');
    });

    it("Test instantRedeem should fail for Insufficient Dynasets", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(account.address);
      await waitForTx(await dynasetFactory.deployDynaset(account.address, account.address, "Test Dynaset", "dynBTC"));
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
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // approve spending of tokens by dynaset
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, account);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [ONE_USDC, SMALL_WBTC_AMOUNT], account.address, "500", "500"));
      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
      console.log("Initialized dynaset");

      // deploy forge
      const forge = await forge_CF.deploy(account.address, dynasetAddress, dynasetOracle.address);
      await waitForTx(await forge.setDeadline(deadline));

      // configure dynaset for forge and oracle
      const dynaset = await dynaset_CF.connect(account).attach(dynasetAddress);
      await waitForTx(await dynaset.setMintForge(forge.address));
      await waitForTx(await dynaset.setBurnForge(forge.address));
      await waitForTx(await dynasetFactory.assignTvlOracle(dynaset.address, dynasetOracle.address));
      await waitForTx(await dynaset.setDeadline(deadline));

      // approve spending of tokens by forge
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, account);
         await waitForTx(await tokenContract.approve(forge.address, ethers.constants.MaxUint256));
      }

       // update oracle
       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
       
       // fast forward blockchain
       const seconds_per_block = 300;
       await ethers.provider.send("evm_increaseTime", [seconds_per_block]);
       await ethers.provider.send("evm_mine", []);

       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());

       // enable instantMint
       await waitForTx(await forge.setInstantMint(true));

       // instant mint 1 USDC in forge
       await waitForTx(await forge.instantMint(ONE_USDC, USDC, account.address, nothing));
 
       // query LP balance
       const userDynasetShares = await dynaset.balanceOf(account.address);
       console.log("LP balance: %s", userDynasetShares/1e18);

       // enable instantRedeem
       await waitForTx(await forge.setInstantRedeem(true));
       
       // approve dynaset shares to be spend by forge
       await waitForTx(await dynaset.approve(forge.address, ethers.constants.MaxUint256));
       
       // Redeem dynaset LP
       var perShareUsdcValue = await dynasetOracle.dynasetUsdcValuePerShare();
       console.log('perShareUsdcValue: %s', (perShareUsdcValue/1e18));
       var usdValue = perShareUsdcValue.mul(userDynasetShares).div(DYNASET_PRECISION); // 18 decimals precision
       console.log('usdValue userShares: %s', (usdValue/1e18));
       var contribPeriodInstantRedeem = await forge.contribPeriodInstantRedeem();
       console.log('contribPeriodInstantRedeem: %s', contribPeriodInstantRedeem);
       var usdValueAfterFees = await forge.capitalSlash(usdValue, contribPeriodInstantRedeem);
       console.log('usdValue after capital slash: %s', (usdValueAfterFees/1e18));
       var minimumAmountOut = usdValueAfterFees.mul(99).div(100).div(1e12); // account for 1% slippage and convert to 6 decimals precision for USDC
       console.log('minimumAmountOut: %s', minimumAmountOut/1e6);

       const usdcContract = new ethers.Contract(USDC, IERC20_ABI, account);
       const balanceBeforeRedeem = await usdcContract.balanceOf(account.address); 
       await expect(forge.instantRedeem(userDynasetShares + 1, USDC, minimumAmountOut, tx_options))
           .to.be.revertedWith('Insufficient Dynasets');
    });

    it("Should fail when passed blacksmith address is zero", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(account.address);
      await waitForTx(await dynasetFactory.deployDynaset(account.address, account.address, "Test Dynaset", "dynBTC"));
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
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // deploy forge
      await expect(forge_CF.deploy(zero_address, dynasetAddress, dynasetOracle.address))
          .to.be.revertedWith("ERR_ZERO_ADDRESS");
    });

    it("Should fail when passed dynaset address is zero", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(account.address);
      await waitForTx(await dynasetFactory.deployDynaset(account.address, account.address, "Test Dynaset", "dynBTC"));
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
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // deploy forge
      await expect(forge_CF.deploy(account.address, zero_address, dynasetOracle.address))
          .to.be.revertedWith("ERR_ZERO_ADDRESS");
    });

    it("Should fail when passed dynaset oracle address is zero", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(account.address);
      await waitForTx(await dynasetFactory.deployDynaset(account.address, account.address, "Test Dynaset", "dynBTC"));
      console.log("Deployed Dynaset");
      const first_dynaset_id = 0;
      const dynasetAddress = await dynasetFactory.dynasets(first_dynaset_id);
      console.log("Dynaset: " + dynasetAddress);

      // deploy forge
      await expect(forge_CF.deploy(account.address, dynasetAddress, zero_address))
          .to.be.revertedWith("ERR_ZERO_ADDRESS");
    });

    it("Test withdrawFee 5% for 0 days", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(account.address);
      await waitForTx(await dynasetFactory.deployDynaset(account.address, account.address, "Test Dynaset", "dynBTC"));
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
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // approve spending of tokens by dynaset
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, account);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [ONE_USDC, SMALL_WBTC_AMOUNT], account.address, "500", "500"));
      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
      console.log("Initialized dynaset");

      // deploy forge
      const forge = await forge_CF.deploy(account.address, dynasetAddress, dynasetOracle.address);
      await waitForTx(await forge.setDeadline(deadline));

      // configure dynaset for forge and oracle
      const dynaset = await dynaset_CF.connect(account).attach(dynasetAddress);
      await waitForTx(await dynaset.setMintForge(forge.address));
      await waitForTx(await dynaset.setBurnForge(forge.address));
      await waitForTx(await dynasetFactory.assignTvlOracle(dynaset.address, dynasetOracle.address));
      await waitForTx(await dynaset.setDeadline(deadline));

      // approve spending of tokens by forge
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, account);
         await waitForTx(await tokenContract.approve(forge.address, ethers.constants.MaxUint256));
      }

       // update oracle
       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
       
       // fast forward blockchain
       const seconds_per_block = 300;
       await ethers.provider.send("evm_increaseTime", [seconds_per_block]);
       await ethers.provider.send("evm_mine", []);

       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());

       // enable instantMint
       await waitForTx(await forge.setInstantMint(true));

       // instant mint 1 USDC in forge
       await waitForTx(await forge.instantMint(ONE_USDC, USDC, account.address, nothing));
 
       // query LP balance
       const userDynasetShares = await dynaset.balanceOf(account.address);
       console.log("LP balance: %s", userDynasetShares/1e18);

       // enable instantRedeem
       await waitForTx(await forge.setInstantRedeem(true));
       
       // set redeem period
       await waitForTx(await forge.setRedeemPeriod(await now()));
       
       // approve dynaset shares to be spend by forge
       await waitForTx(await dynaset.approve(forge.address, ethers.constants.MaxUint256));

       // simulate 1 USDC gain
       const usdcContract = new ethers.Contract(USDC, IERC20_ABI, account);
       await waitForTx(await usdcContract.transfer(dynaset.address, ONE_USDC));
       await waitForTx(await dynaset.updateAfterSwap(USDC, USDC));
       console.log('simulated USDC gain');
       
       // Redeem dynaset LP
       var perShareUsdcValue = await dynasetOracle.dynasetUsdcValuePerShare();
       console.log('perShareUsdcValue: %s', (perShareUsdcValue/1e18));
       var usdValue = perShareUsdcValue.mul(userDynasetShares).div(DYNASET_PRECISION); // 18 decimals precision
       console.log('usdValue userShares: %s', (usdValue/1e18));
       var contribPeriodInstantRedeem = await forge.contribPeriodInstantRedeem();
       console.log('contribPeriodInstantRedeem: %s', contribPeriodInstantRedeem);
       var usdValueAfterFees = await forge.capitalSlash(usdValue, contribPeriodInstantRedeem);
       console.log('usdValue after capital slash: %s', (usdValueAfterFees/1e18));
       var minimumAmountOut = usdValueAfterFees.mul(98).div(100).div(1e12); // account for 2% slippage and convert to 6 decimals precision for USDC
       console.log('minimumAmountOut: %s', minimumAmountOut/1e6);

       const balanceBeforeRedeem = await usdcContract.balanceOf(account.address); 
       await waitForTx(await forge.instantRedeem(userDynasetShares, USDC, minimumAmountOut, tx_options));
       const balanceAfterRedeem = await usdcContract.balanceOf(account.address); 
       console.log('Redeemed dynaset LP');
       const redeemed = balanceAfterRedeem-balanceBeforeRedeem;
       console.log('redeemed: %s', redeemed/1e6);
       expect(redeemed).to.be.at.least(minimumAmountOut);
  
       // calculate fee
       const expectedFee = userDynasetShares/1e18*0.05; // 5% fee within 30 days
       console.log('expectedFee: %s', expectedFee);
       const totalFee = await forge.totalFee();
       console.log('totalFee: %s', totalFee/1e18);
       expect(Number(totalFee/1e18).toFixed(6))
           .to.be.equal(Number(expectedFee).toFixed(6));
       
       // withdraw fee
       await waitForTx(await forge.withdrawFee());
       console.log('withdrawn Fee');
       const totalFeeAfterWithdraw = await forge.totalFee();
       console.log('totalFee after withdraw: %s', totalFeeAfterWithdraw/1e18);
       expect(totalFeeAfterWithdraw)
           .to.be.equal(nothing);
       
    });

    it("Test withdrawFee 4% for 31 days", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(account.address);
      await waitForTx(await dynasetFactory.deployDynaset(account.address, account.address, "Test Dynaset", "dynBTC"));
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
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // approve spending of tokens by dynaset
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, account);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [ONE_USDC, SMALL_WBTC_AMOUNT], account.address, "500", "500"));
      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
      console.log("Initialized dynaset");

      // deploy forge
      const forge = await forge_CF.deploy(account.address, dynasetAddress, dynasetOracle.address);
      await waitForTx(await forge.setDeadline(deadline));

      // configure dynaset for forge and oracle
      const dynaset = await dynaset_CF.connect(account).attach(dynasetAddress);
      await waitForTx(await dynaset.setMintForge(forge.address));
      await waitForTx(await dynaset.setBurnForge(forge.address));
      await waitForTx(await dynasetFactory.assignTvlOracle(dynaset.address, dynasetOracle.address));
      await waitForTx(await dynaset.setDeadline(deadline));

      // approve spending of tokens by forge
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, account);
         await waitForTx(await tokenContract.approve(forge.address, ethers.constants.MaxUint256));
      }

       // update oracle
       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
       
       // fast forward blockchain
       const seconds_per_block = 300;
       await ethers.provider.send("evm_increaseTime", [seconds_per_block]);
       await ethers.provider.send("evm_mine", []);

       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());

       // enable instantMint
       await waitForTx(await forge.setInstantMint(true));

       // instant mint 1 USDC in forge
       await waitForTx(await forge.instantMint(ONE_USDC, USDC, account.address, nothing));
 
       // query LP balance
       const userDynasetShares = await dynaset.balanceOf(account.address);
       console.log("LP balance: %s", userDynasetShares/1e18);

       // enable instantRedeem
       await waitForTx(await forge.setInstantRedeem(true));
       
       // set redeem period
       await waitForTx(await forge.setRedeemPeriod((await now()) - 31*days));
       
       // approve dynaset shares to be spend by forge
       await waitForTx(await dynaset.approve(forge.address, ethers.constants.MaxUint256));

       // simulate 1 USDC gain
       const usdcContract = new ethers.Contract(USDC, IERC20_ABI, account);
       await waitForTx(await usdcContract.transfer(dynaset.address, ONE_USDC));
       await waitForTx(await dynaset.updateAfterSwap(USDC, USDC));
       console.log('simulated USDC gain');
       
       // Redeem dynaset LP
       var perShareUsdcValue = await dynasetOracle.dynasetUsdcValuePerShare();
       console.log('perShareUsdcValue: %s', (perShareUsdcValue/1e18));
       var usdValue = perShareUsdcValue.mul(userDynasetShares).div(DYNASET_PRECISION); // 18 decimals precision
       console.log('usdValue userShares: %s', (usdValue/1e18));
       var contribPeriodInstantRedeem = await forge.contribPeriodInstantRedeem();
       console.log('contribPeriodInstantRedeem: %s', contribPeriodInstantRedeem);
       var usdValueAfterFees = await forge.capitalSlash(usdValue, contribPeriodInstantRedeem);
       console.log('usdValue after capital slash: %s', (usdValueAfterFees/1e18));
       var minimumAmountOut = usdValueAfterFees.mul(98).div(100).div(1e12); // account for 2% slippage and convert to 6 decimals precision for USDC
       console.log('minimumAmountOut: %s', minimumAmountOut/1e6);

       const balanceBeforeRedeem = await usdcContract.balanceOf(account.address); 
       await waitForTx(await forge.instantRedeem(userDynasetShares, USDC, minimumAmountOut, tx_options));
       const balanceAfterRedeem = await usdcContract.balanceOf(account.address); 
       console.log('Redeemed dynaset LP');
       const redeemed = balanceAfterRedeem-balanceBeforeRedeem;
       console.log('redeemed: %s', redeemed/1e6);
       expect(redeemed).to.be.at.least(minimumAmountOut);
  
       // calculate fee
       const expectedFee = userDynasetShares/1e18*0.04; // 4% fee within 30-60 days
       console.log('expectedFee: %s', expectedFee);
       const totalFee = await forge.totalFee();
       console.log('totalFee: %s', totalFee/1e18);
       expect(Number(totalFee/1e18).toFixed(6))
           .to.be.equal(Number(expectedFee).toFixed(6));
       
       // withdraw fee
       await waitForTx(await forge.withdrawFee());
       console.log('withdrawn Fee');
       const totalFeeAfterWithdraw = await forge.totalFee();
       console.log('totalFee after withdraw: %s', totalFeeAfterWithdraw/1e18);
       expect(totalFeeAfterWithdraw)
           .to.be.equal(nothing);
       
    });

    it("Test withdrawFee 2.5% for 61 days", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(account.address);
      await waitForTx(await dynasetFactory.deployDynaset(account.address, account.address, "Test Dynaset", "dynBTC"));
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
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // approve spending of tokens by dynaset
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, account);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [ONE_USDC, SMALL_WBTC_AMOUNT], account.address, "500", "500"));
      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
      console.log("Initialized dynaset");

      // deploy forge
      const forge = await forge_CF.deploy(account.address, dynasetAddress, dynasetOracle.address);
      await waitForTx(await forge.setDeadline(deadline));

      // configure dynaset for forge and oracle
      const dynaset = await dynaset_CF.connect(account).attach(dynasetAddress);
      await waitForTx(await dynaset.setMintForge(forge.address));
      await waitForTx(await dynaset.setBurnForge(forge.address));
      await waitForTx(await dynasetFactory.assignTvlOracle(dynaset.address, dynasetOracle.address));
      await waitForTx(await dynaset.setDeadline(deadline));

      // approve spending of tokens by forge
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, account);
         await waitForTx(await tokenContract.approve(forge.address, ethers.constants.MaxUint256));
      }

       // update oracle
       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
       
       // fast forward blockchain
       const seconds_per_block = 300;
       await ethers.provider.send("evm_increaseTime", [seconds_per_block]);
       await ethers.provider.send("evm_mine", []);

       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());

       // enable instantMint
       await waitForTx(await forge.setInstantMint(true));

       // instant mint 1 USDC in forge
       await waitForTx(await forge.instantMint(ONE_USDC, USDC, account.address, nothing));
 
       // query LP balance
       const userDynasetShares = await dynaset.balanceOf(account.address);
       console.log("LP balance: %s", userDynasetShares/1e18);

       // enable instantRedeem
       await waitForTx(await forge.setInstantRedeem(true));
       
       // set redeem period
       await waitForTx(await forge.setRedeemPeriod((await now()) - 61*days));
       
       // approve dynaset shares to be spend by forge
       await waitForTx(await dynaset.approve(forge.address, ethers.constants.MaxUint256));

       // simulate 1 USDC gain
       const usdcContract = new ethers.Contract(USDC, IERC20_ABI, account);
       await waitForTx(await usdcContract.transfer(dynaset.address, ONE_USDC));
       await waitForTx(await dynaset.updateAfterSwap(USDC, USDC));
       console.log('simulated USDC gain');
       
       // Redeem dynaset LP
       var perShareUsdcValue = await dynasetOracle.dynasetUsdcValuePerShare();
       console.log('perShareUsdcValue: %s', (perShareUsdcValue/1e18));
       var usdValue = perShareUsdcValue.mul(userDynasetShares).div(DYNASET_PRECISION); // 18 decimals precision
       console.log('usdValue userShares: %s', (usdValue/1e18));
       var contribPeriodInstantRedeem = await forge.contribPeriodInstantRedeem();
       console.log('contribPeriodInstantRedeem: %s', contribPeriodInstantRedeem);
       var usdValueAfterFees = await forge.capitalSlash(usdValue, contribPeriodInstantRedeem);
       console.log('usdValue after capital slash: %s', (usdValueAfterFees/1e18));
       var minimumAmountOut = usdValueAfterFees.mul(98).div(100).div(1e12); // account for 2% slippage and convert to 6 decimals precision for USDC
       console.log('minimumAmountOut: %s', minimumAmountOut/1e6);

       const balanceBeforeRedeem = await usdcContract.balanceOf(account.address); 
       await waitForTx(await forge.instantRedeem(userDynasetShares, USDC, minimumAmountOut, tx_options));
       const balanceAfterRedeem = await usdcContract.balanceOf(account.address); 
       console.log('Redeemed dynaset LP');
       const redeemed = balanceAfterRedeem-balanceBeforeRedeem;
       console.log('redeemed: %s', redeemed/1e6);
       expect(redeemed).to.be.at.least(minimumAmountOut);
  
       // calculate fee
       const expectedFee = userDynasetShares/1e18*0.025; // 2.5% fee within 60-90 days
       console.log('expectedFee: %s', expectedFee);
       const totalFee = await forge.totalFee();
       console.log('totalFee: %s', totalFee/1e18);
       expect(Number(totalFee/1e18).toFixed(6))
           .to.be.equal(Number(expectedFee).toFixed(6));
       
       // withdraw fee
       await waitForTx(await forge.withdrawFee());
       console.log('withdrawn Fee');
       const totalFeeAfterWithdraw = await forge.totalFee();
       console.log('totalFee after withdraw: %s', totalFeeAfterWithdraw/1e18);
       expect(totalFeeAfterWithdraw)
           .to.be.equal(nothing);
       
    });

    it("Test withdrawFee 0% for 91 days", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(account.address);
      await waitForTx(await dynasetFactory.deployDynaset(account.address, account.address, "Test Dynaset", "dynBTC"));
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
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // approve spending of tokens by dynaset
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, account);
         await waitForTx(await tokenContract.approve(dynasetAddress, ethers.constants.MaxUint256));
      }
      
      // initialize dynaset
      await waitForTx(await dynasetFactory.initialiseDynaset(dynasetAddress, [USDC, WBTC], [ONE_USDC, SMALL_WBTC_AMOUNT], account.address, "500", "500"));
      await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
      console.log("Initialized dynaset");

      // deploy forge
      const forge = await forge_CF.deploy(account.address, dynasetAddress, dynasetOracle.address);
      await waitForTx(await forge.setDeadline(deadline));

      // configure dynaset for forge and oracle
      const dynaset = await dynaset_CF.connect(account).attach(dynasetAddress);
      await waitForTx(await dynaset.setMintForge(forge.address));
      await waitForTx(await dynaset.setBurnForge(forge.address));
      await waitForTx(await dynasetFactory.assignTvlOracle(dynaset.address, dynasetOracle.address));
      await waitForTx(await dynaset.setDeadline(deadline));

      // approve spending of tokens by forge
      for (const token of [WETH, USDC, WBTC]) {
         const tokenContract = new ethers.Contract(token, IERC20_ABI, account);
         await waitForTx(await tokenContract.approve(forge.address, ethers.constants.MaxUint256));
      }

       // update oracle
       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());
       
       // fast forward blockchain
       const seconds_per_block = 300;
       await ethers.provider.send("evm_increaseTime", [seconds_per_block]);
       await ethers.provider.send("evm_mine", []);

       await waitForTx(await dynasetOracle.updateDynasetTokenPrices());

       // enable instantMint
       await waitForTx(await forge.setInstantMint(true));

       // instant mint 1 USDC in forge
       await waitForTx(await forge.instantMint(ONE_USDC, USDC, account.address, nothing));
 
       // query LP balance
       const userDynasetShares = await dynaset.balanceOf(account.address);
       console.log("LP balance: %s", userDynasetShares/1e18);

       // enable instantRedeem
       await waitForTx(await forge.setInstantRedeem(true));
       
       // set redeem period
       await waitForTx(await forge.setRedeemPeriod((await now()) - 91*days));
       
       // approve dynaset shares to be spend by forge
       await waitForTx(await dynaset.approve(forge.address, ethers.constants.MaxUint256));

       // simulate 1 USDC gain
       const usdcContract = new ethers.Contract(USDC, IERC20_ABI, account);
       await waitForTx(await usdcContract.transfer(dynaset.address, ONE_USDC));
       await waitForTx(await dynaset.updateAfterSwap(USDC, USDC));
       console.log('simulated USDC gain');
       
       // Redeem dynaset LP
       var perShareUsdcValue = await dynasetOracle.dynasetUsdcValuePerShare();
       console.log('perShareUsdcValue: %s', (perShareUsdcValue/1e18));
       var usdValue = perShareUsdcValue.mul(userDynasetShares).div(DYNASET_PRECISION); // 18 decimals precision
       console.log('usdValue userShares: %s', (usdValue/1e18));
       var contribPeriodInstantRedeem = await forge.contribPeriodInstantRedeem();
       console.log('contribPeriodInstantRedeem: %s', contribPeriodInstantRedeem);
       var usdValueAfterFees = await forge.capitalSlash(usdValue, contribPeriodInstantRedeem);
       console.log('usdValue after capital slash: %s', (usdValueAfterFees/1e18));
       var minimumAmountOut = usdValueAfterFees.mul(98).div(100).div(1e12); // account for 2% slippage and convert to 6 decimals precision for USDC
       console.log('minimumAmountOut: %s', minimumAmountOut/1e6);

       const balanceBeforeRedeem = await usdcContract.balanceOf(account.address); 
       await waitForTx(await forge.instantRedeem(userDynasetShares, USDC, minimumAmountOut, tx_options));
       const balanceAfterRedeem = await usdcContract.balanceOf(account.address); 
       console.log('Redeemed dynaset LP');
       const redeemed = balanceAfterRedeem-balanceBeforeRedeem;
       console.log('redeemed: %s', redeemed/1e6);
       expect(redeemed).to.be.at.least(minimumAmountOut);
  
       // calculate fee
       const expectedFee = 0; // 0% fee for +90 days
       console.log('expectedFee: %s', expectedFee);
       const totalFee = await forge.totalFee();
       console.log('totalFee: %s', totalFee/1e18);
       expect(Number(totalFee/1e18).toFixed(6))
           .to.be.equal(Number(expectedFee).toFixed(6));
       
       // withdraw fee
       await waitForTx(await forge.withdrawFee());
       console.log('withdrawn Fee');
       const totalFeeAfterWithdraw = await forge.totalFee();
       console.log('totalFee after withdraw: %s', totalFeeAfterWithdraw/1e18);
       expect(totalFeeAfterWithdraw)
           .to.be.equal(nothing);
       
    });

    it("Should fail when unprivileged account tries to enable instant mint", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(account.address);
      await waitForTx(await dynasetFactory.deployDynaset(account.address, account.address, "Test Dynaset", "dynBTC"));
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
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // deploy forge
      const forge = await forge_CF.deploy(account.address, dynasetAddress, dynasetOracle.address);
      await waitForTx(await forge.setDeadline(deadline));
      
      const black_smith_role = await forge.BLACK_SMITH();
      await expect(forge.connect(unprivileged_account).setInstantMint(true))
          .to.be.revertedWith("AccessControl: account "+unprivileged_account.address.toLowerCase()+" is missing role "+black_smith_role);
    });

    it("Should fail when unprivileged account tries to enable instant redeem", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(account.address);
      await waitForTx(await dynasetFactory.deployDynaset(account.address, account.address, "Test Dynaset", "dynBTC"));
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
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // deploy forge
      const forge = await forge_CF.deploy(account.address, dynasetAddress, dynasetOracle.address);
      await waitForTx(await forge.setDeadline(deadline));
      
      const black_smith_role = await forge.BLACK_SMITH();
      await expect(forge.connect(unprivileged_account).setInstantRedeem(true))
          .to.be.revertedWith("AccessControl: account "+unprivileged_account.address.toLowerCase()+" is missing role "+black_smith_role);
    });

    it("Should fail when unprivileged account tries to set redeem period", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(account.address);
      await waitForTx(await dynasetFactory.deployDynaset(account.address, account.address, "Test Dynaset", "dynBTC"));
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
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // deploy forge
      const forge = await forge_CF.deploy(account.address, dynasetAddress, dynasetOracle.address);
      await waitForTx(await forge.setDeadline(deadline));
      
      const black_smith_role = await forge.BLACK_SMITH();
      await expect(forge.connect(unprivileged_account).setRedeemPeriod(await now()))
          .to.be.revertedWith("AccessControl: account "+unprivileged_account.address.toLowerCase()+" is missing role "+black_smith_role);
    });

    it("Should fail when unprivileged account tries to update uniswap v2 router", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(account.address);
      await waitForTx(await dynasetFactory.deployDynaset(account.address, account.address, "Test Dynaset", "dynBTC"));
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
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // deploy forge
      const forge = await forge_CF.deploy(account.address, dynasetAddress, dynasetOracle.address);
      await waitForTx(await forge.setDeadline(deadline));
      
      const black_smith_role = await forge.BLACK_SMITH();
      await expect(forge.connect(unprivileged_account).upgradeUniswapV2Router(sushiswap_v2_router))
          .to.be.revertedWith("AccessControl: account "+unprivileged_account.address.toLowerCase()+" is missing role "+black_smith_role);
    });

    it("Should update when privileged account tries to update uniswap v2 router", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(account.address);
      await waitForTx(await dynasetFactory.deployDynaset(account.address, account.address, "Test Dynaset", "dynBTC"));
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
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // deploy forge
      const forge = await forge_CF.deploy(account.address, dynasetAddress, dynasetOracle.address);
      await waitForTx(await forge.setDeadline(deadline));

      // expect default to be uniswap v2 router
      const current_router = await forge.uniswapV2Router();
      expect(current_router)
          .to.be.equal(uniswap_v2_router);
            
      // should update to sushiswap
      await forge.connect(account).upgradeUniswapV2Router(sushiswap_v2_router);
      const new_router = await forge.uniswapV2Router();
      expect(new_router)
          .to.be.equal(sushiswap_v2_router);
    });

    it("Should fail when unprivileged account tries to update oracle", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(account.address);
      await waitForTx(await dynasetFactory.deployDynaset(account.address, account.address, "Test Dynaset", "dynBTC"));
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
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // deploy forge
      const forge = await forge_CF.deploy(account.address, dynasetAddress, dynasetOracle.address);
      await waitForTx(await forge.setDeadline(deadline));
      
      const black_smith_role = await forge.BLACK_SMITH();
      await expect(forge.connect(unprivileged_account).updateOracle(dynasetOracle.address))
          .to.be.revertedWith("AccessControl: account "+unprivileged_account.address.toLowerCase()+" is missing role "+black_smith_role);
    });

    it("Should update when privileged account tries to update oracle", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(account.address);
      await waitForTx(await dynasetFactory.deployDynaset(account.address, account.address, "Test Dynaset", "dynBTC"));
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
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      const dynasetOracle2 = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed 2nd oracle");

      // deploy forge
      const forge = await forge_CF.deploy(account.address, dynasetAddress, dynasetOracle.address);
      await waitForTx(await forge.setDeadline(deadline));
      
      await waitForTx(await forge.connect(account).updateOracle(dynasetOracle2.address));
      const updated_oracle = await forge.dynasetTvlOracle();
      expect(updated_oracle)
          .to.be.equal(dynasetOracle2.address);
    });

    it("Should fail when unprivileged account tries to withdraw fee", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(account.address);
      await waitForTx(await dynasetFactory.deployDynaset(account.address, account.address, "Test Dynaset", "dynBTC"));
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
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // deploy forge
      const forge = await forge_CF.deploy(account.address, dynasetAddress, dynasetOracle.address);
      await waitForTx(await forge.setDeadline(deadline));
      
      const black_smith_role = await forge.BLACK_SMITH();
      await expect(forge.connect(unprivileged_account).withdrawFee())
          .to.be.revertedWith("AccessControl: account "+unprivileged_account.address.toLowerCase()+" is missing role "+black_smith_role);
    });

    it("Should fail when unprivileged account tries to set deadline", async () => {
      // deploy dynaset
      const dynasetFactory = await dynasetFactory_CF.deploy(account.address);
      await waitForTx(await dynasetFactory.deployDynaset(account.address, account.address, "Test Dynaset", "dynBTC"));
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
      const dynasetOracle = await dynasetTvlOracle_CF.deploy(dynasetAddress, USDC, usdcOracle.address);
      console.log("Deployed DynasetTvlOracle");

      // deploy forge
      const forge = await forge_CF.deploy(account.address, dynasetAddress, dynasetOracle.address);

      const black_smith_role = await forge.BLACK_SMITH();
      await expect(forge.connect(unprivileged_account).setDeadline(deadline))
          .to.be.revertedWith("AccessControl: account "+unprivileged_account.address.toLowerCase()+" is missing role "+black_smith_role);
    });

  });
});

