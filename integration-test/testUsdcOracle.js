const { expect } = require("chai");
const hre = require("hardhat");
const ethers = hre.ethers;

const BigNumber = require("bignumber.js");

const WETH_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}];
const IERC20_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];
const UniswapV2Router_ABI = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
const Chainlink_ABI = [{"inputs":[{"internalType":"address","name":"_aggregator","type":"address"},{"internalType":"address","name":"_accessController","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"int256","name":"current","type":"int256"},{"indexed":true,"internalType":"uint256","name":"roundId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"updatedAt","type":"uint256"}],"name":"AnswerUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"roundId","type":"uint256"},{"indexed":true,"internalType":"address","name":"startedBy","type":"address"},{"indexed":false,"internalType":"uint256","name":"startedAt","type":"uint256"}],"name":"NewRound","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"OwnershipTransferRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"accessController","outputs":[{"internalType":"contract AccessControllerInterface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"aggregator","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_aggregator","type":"address"}],"name":"confirmAggregator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"description","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_roundId","type":"uint256"}],"name":"getAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint80","name":"_roundId","type":"uint80"}],"name":"getRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_roundId","type":"uint256"}],"name":"getTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRound","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint16","name":"","type":"uint16"}],"name":"phaseAggregators","outputs":[{"internalType":"contract AggregatorV2V3Interface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"phaseId","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_aggregator","type":"address"}],"name":"proposeAggregator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"proposedAggregator","outputs":[{"internalType":"contract AggregatorV2V3Interface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint80","name":"_roundId","type":"uint80"}],"name":"proposedGetRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proposedLatestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_accessController","type":"address"}],"name":"setController","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

// vars
const tx_options = {gasLimit:150000000, gasPrice: 50000000000};

const nothing = 0;

const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const DAI =  "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const YFI = "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e";
const MAKER = "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2";
const AAVE = "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9";
const LINK = "0x514910771af9ca656af840dff83e8264ecf986ca";
const CRV = "0xD533a949740bb3306d119CC777fa900bA034cd52";
const COMP = "0xc00e94cb662c3520282e6f5717214004a7f26888";
const UNI = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984";
const MIM = "0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3";
const ONEINCH = "0x111111111117dc0aa78b770fa6a738034120c302";

const ELON = "0x761d38e5ddf6ccf6cf7c55759d5210750b5d60f3";
const SHIBA = "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE";

const SDAO = "0x993864E43Caa7F7F12953AD6fEb1d1Ca635B875F";
const NTX = "0xF0d33BeDa4d734C72684b5f9abBEbf715D0a7935";
const AGIX = "0x5B7533812759B45C2B44C19e320ba2cD2681b542";

const SHARE_PRECISION = new BigNumber("1000000000000000000").toFixed(); // 18 decimals

const uniswapRouter_address = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const uniswapv2Factory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
const uniswapv3Factory = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
const chainlink_feedRegistry = "0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf";

const HALF_USDC = "500000";
const ONE_USDC = "1000000";
const ONE_USDT = "1000000";
const FIVE_HUNDRED_USDC = "500000000";
const ONE_THOUSAND_USDC = "1000000000";
const HUNDRED_THOUSAND_USDC = "100000000000";
const HALF_MILLION_USDC = "500000000000";
const ONE_MILLION_USDC = "1000000000000";
const TEN_MILLION_USDC = "10000000000000";

const ONE_WETH = "1000000000000000000";
const ONE_HUNDRED_WETH = "100000000000000000000";
const ONE_MILLION_WETH = "1000000000000000000000000";

const ONE_WBTC = "100000000";
const TEN_WBTC = "1000000000";

const ONE_DAI = "1000000000000000000";
const ONE_YFI = "1000000000000000000";
const ONE_MAKER = "1000000000000000000";
const ONE_AAVE = "1000000000000000000";
const ONE_LINK = "1000000000000000000";
const ONE_CRV = "1000000000000000000";
const ONE_COMP = "1000000000000000000";
const ONE_UNI = "1000000000000000000";
const ONE_MIM = "1000000000000000000";
const ONE_1INCH = "1000000000000000000";
const ONE_BILLION_ELON = "1000000000000000000000000000";
const ONE_MILLION_SHIBA = "1000000000000000000000000";

const ONE_SDAO = "1000000000000000000";
const ONE_NTX = "1000000";
const ONE_AGIX = "100000000";

const observation_period = 240;
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

async function updateOracle(oracle, token) {
        await waitForTx(await oracle.updateWethPrice());
        await waitForTx(await oracle.updatePrice(token));

        // fast forward blockchain
        const seconds_per_block = 300;
        await ethers.provider.send("evm_increaseTime", [seconds_per_block]);
        await ethers.provider.send("evm_mine", []);
}

var uniswapv2Oracle_CF;
var uniswapRouter;

var initialized = false;

var init = async function() {
      console.log('init');

      // get contract factory
      chainlinkOracle_CF = await ethers.getContractFactory("ChainlinkOracle");
      uniswapv3Oracle_CF = await ethers.getContractFactory("Uniswapv3Oracle");
      uniswapv2Oracle_CF = await ethers.getContractFactory("Uniswapv2Oracle");
      usdcOracle_CF = await ethers.getContractFactory("UsdcOracle");
      initialized = true;
}

describe("UsdcOracle contract", function () {
  var oracle;
  var chainlinkOracle;
  var uniswapv3Oracle;
  var uniswapv2Oracle;

  beforeEach(async () => {
      if (!initialized) await init();
  });
  	
  describe("Deployment of UsdcOracle", () => {
    beforeEach(async () => {
        // deploy oracles
        chainlinkOracle = await chainlinkOracle_CF.deploy(chainlink_feedRegistry, USDC, WETH, WBTC);
        uniswapv3Oracle = await uniswapv3Oracle_CF.deploy(uniswapv3Factory, observation_period, USDC, WETH);
        uniswapv2Oracle = await uniswapv2Oracle_CF.deploy(uniswapv2Factory, observation_period, USDC, WETH);      
    });


    it("Test deploy UsdcOracle", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        console.log("Deployed UsdcOracle");
        expect(await oracle.preferredOracle())
            .to.be.equal(chainlinkOracle.address);
        expect(await oracle.USDC())
            .to.be.equal(USDC);
    });

    it("Test tokenUsdcValue(USDC, 1,000,000.0)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, WBTC);

        const results = await oracle.tokenUsdcValue(USDC, ONE_MILLION_USDC);
        const value = results[0];
        const timestamp = results[1];
        console.log("tokenUsdcValue(USDC, 1,000,000.0) = %s (timestamp: %s)", value/1e6, timestamp);
        expect(value).
            to.be.equal(ONE_MILLION_USDC);
    });

    it("Test tokenUsdcValue(WBTC, 1.0)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, WBTC);

        const results = await oracle.tokenUsdcValue(WBTC, ONE_WBTC);
        const value = results[0];
        const timestamp = results[1];
        console.log("tokenUsdcValue(WBTC, 1.0) = %s (timestamp: %s)", value/1e6, timestamp);
    });

    it("Test tokenUsdcValue(WBTC, 10.0)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, WBTC);

        const results = await oracle.tokenUsdcValue(WBTC, TEN_WBTC);
        const value = results[0];
        const timestamp = results[1];
        console.log("tokenUsdcValue(WBTC, 10.0) = %s (timestamp: %s)", value/1e6, timestamp);
    });

    it("Test tokenUsdcValue(USDT, 1.0)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, USDT);

        const results = await oracle.tokenUsdcValue(USDT, ONE_USDT);
        const value = results[0];
        const timestamp = results[1];
        console.log("tokenUsdcValue(USDT, 1.0) = %s (timestamp: %s)", value/1e6, timestamp);
    });

    it("Test tokenUsdcValue(WETH, 1.0)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, WETH);

        const results = await oracle.tokenUsdcValue(WETH, ONE_WETH);
        const value = results[0];
        const timestamp = results[1];
        console.log("tokenUsdcValue(WETH, 1.0) = %s (timestamp: %s)", value/1e6, timestamp);
    });

    it("Test tokenUsdcValue(DAI, 1.0)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, DAI);

        const results = await oracle.tokenUsdcValue(DAI, ONE_DAI);
        const value = results[0];
        const timestamp = results[1];
        console.log("tokenUsdcValue(DAI, 1.0) = %s (timestamp: %s)", value/1e6, timestamp);
    });

    it("Test tokenUsdcValue(YFI, 1.0)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, YFI);

        const results = await oracle.tokenUsdcValue(YFI, ONE_YFI);
        const value = results[0];
        const timestamp = results[1];
        console.log("tokenUsdcValue(YFI, 1.0) = %s (timestamp: %s)", value/1e6, timestamp);
    });

    it("Test tokenUsdcValue(MAKER, 1.0)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, MAKER);

        const results = await oracle.tokenUsdcValue(MAKER, ONE_MAKER);
        const value = results[0];
        const timestamp = results[1];
        console.log("tokenUsdcValue(MAKER, 1.0) = %s (timestamp: %s)", value/1e6, timestamp);
    });

    it("Test tokenUsdcValue(AAVE, 1.0)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, AAVE);
        
        const results = await oracle.tokenUsdcValue(AAVE, ONE_AAVE);
        const value = results[0];
        const timestamp = results[1];
        console.log("tokenUsdcValue(AAVE, 1.0) = %s (timestamp: %s)", value/1e6, timestamp);
    });

    it("Test tokenUsdcValue(LINK, 1.0)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, LINK);

        const results = await oracle.tokenUsdcValue(LINK, ONE_LINK);
        const value = results[0];
        const timestamp = results[1];
        console.log("tokenUsdcValue(LINK, 1.0) = %s (timestamp: %s)", value/1e6, timestamp);
    });

    it("Test tokenUsdcValue(CRV, 1.0)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, CRV);

        const results = await oracle.tokenUsdcValue(CRV, ONE_CRV);
        const value = results[0];
        const timestamp = results[1];
        console.log("tokenUsdcValue(CRV, 1.0) = %s (timestamp: %s)", value/1e6, timestamp);
    });

    it("Test tokenUsdcValue(COMP, 1.0)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, COMP);

        const results = await oracle.tokenUsdcValue(COMP, ONE_COMP);
        const value = results[0];
        const timestamp = results[1];
        console.log("tokenUsdcValue(COMP, 1.0) = %s (timestamp: %s)", value/1e6, timestamp);
    });

    it("Test tokenUsdcValue(UNI, 1.0)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, UNI);

        const results = await oracle.tokenUsdcValue(UNI, ONE_UNI);
        const value = results[0];
        const timestamp = results[1];
        console.log("tokenUsdcValue(UNI, 1.0) = %s (timestamp: %s)", value/1e6, timestamp);
    });

    it("Test tokenUsdcValue(MIM, 1.0)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, MIM);

        const results = await oracle.tokenUsdcValue(MIM, ONE_MIM);
        const value = results[0];
        const timestamp = results[1];
        console.log("tokenUsdcValue(MIM, 1.0) = %s (timestamp: %s)", value/1e6, timestamp);
    });

    it("Test tokenUsdcValue(1INCH, 1.0)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, ONEINCH);

        const results = await oracle.tokenUsdcValue(ONEINCH, ONE_1INCH);
        const value = results[0];
        const timestamp = results[1];
        console.log("tokenUsdcValue(1INCH, 1.0) = %s (timestamp: %s)", value/1e6, timestamp);
    });

    it("Test tokenUsdcValue(ELON, 1,000,000,000.0)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, ELON);

        const results = await oracle.tokenUsdcValue(ELON, ONE_BILLION_ELON);
        const value = results[0];
        const timestamp = results[1];
        console.log("tokenUsdcValue(ELON, 1,000,000,000.0) = %s (timestamp: %s)", value/1e6, timestamp);
    });

    it("Test tokenUsdcValue(SHIBA, 1,000,000.0)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, SHIBA);

        const results = await oracle.tokenUsdcValue(SHIBA, ONE_MILLION_SHIBA);
        const value = results[0];
        const timestamp = results[1];
        console.log("tokenUsdcValue(SHIBA, 1,000,000.0) = %s (timestamp: %s)", value/1e6, timestamp);
    });

    it("Test tokenUsdcValue(SDAO, 1.0)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, SDAO);

        const results = await oracle.tokenUsdcValue(SDAO, ONE_SDAO);
        const value = results[0];
        const timestamp = results[1];
        console.log("tokenUsdcValue(SDAO, 1.0) = %s (timestamp: %s)", value/1e6, timestamp);
    });

    it("Test tokenUsdcValue(NTX, 1.0)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, NTX);

        const results = await oracle.tokenUsdcValue(NTX, ONE_NTX);
        const value = results[0];
        const timestamp = results[1];
        console.log("tokenUsdcValue(NTX, 1.0) = %s (timestamp: %s)", value/1e6, timestamp);
    });

    it("Test tokenUsdcValue(AGIX, 1.0)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, AGIX);

        const results = await oracle.tokenUsdcValue(AGIX, ONE_AGIX);
        const value = results[0];
        const timestamp = results[1];
        console.log("tokenUsdcValue(AGIX, 1.0) = %s (timestamp: %s)", value/1e6, timestamp);
    });

    it("Test getPrice(USDT, USDC)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, USDT);

        const results = await oracle.getPrice(USDT, USDC);
        const price = results[0];
        const timestamp = results[1];
        console.log("getPrice(USDT, USDC) = %s (timestamp: %s)", price, timestamp);
    });

    it("Test getPrice(USDT, USDC) with paused preferred oracle ChainlinkOracle", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, USDT);
        await waitForTx(await oracle.setPaused(chainlinkOracle.address, true));

        const results = await oracle.getPrice(USDT, USDC);
        const price = results[0];
        const timestamp = results[1];
        console.log("getPrice(USDT, USDC) = %s (timestamp: %s)", price, timestamp);
    });

    it("Test getPrice(USDT, USDC) with paused fallback oracle UniswapV3Oracle", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, USDT);
        await waitForTx(await oracle.setPaused(uniswapv3Oracle.address, true));

        const results = await oracle.getPrice(USDT, USDC);
        const price = results[0];
        const timestamp = results[1];
        console.log("getPrice(USDT, USDC) = %s (timestamp: %s)", price, timestamp);
    });

    it("Test getPrice(USDT, USDC) with paused fallback oracle UniswapV2Oracle", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, USDT);
        await waitForTx(await oracle.setPaused(uniswapv2Oracle.address, true));

        const results = await oracle.getPrice(USDT, USDC);
        const price = results[0];
        const timestamp = results[1];
        console.log("getPrice(USDT, USDC) = %s (timestamp: %s)", price, timestamp);
    });

    it("Test getPrice(USDT, USDC) with all fallback oracles paused", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, USDT);
        await waitForTx(await oracle.setPaused(uniswapv3Oracle.address, true));
        await waitForTx(await oracle.setPaused(uniswapv2Oracle.address, true));

        const results = await oracle.getPrice(USDT, USDC);
        const price = results[0];
        const timestamp = results[1];
        console.log("getPrice(USDT, USDC) = %s (timestamp: %s)", price, timestamp);
    });

    it("Test getPrice(USDT, USDC) with all oracles paused should throw ERR_STALE_ORACLE", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, USDT);
        await waitForTx(await oracle.setPaused(chainlinkOracle.address, true));
        await waitForTx(await oracle.setPaused(uniswapv3Oracle.address, true));
        await waitForTx(await oracle.setPaused(uniswapv2Oracle.address, true));

        await expect(oracle.getPrice(USDT, USDC))
            .to.be.revertedWith("ERR_STALE_ORACLE");
    });

    it("Test getPrice(USDC, USDT)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, USDT);

        const results = await oracle.getPrice(USDC, USDT);
        const price = results[0];
        const timestamp = results[1];
        console.log("getPrice(USDC, USDT) = %s (timestamp: %s)", price, timestamp);
    });

    it("Test getPrice(WETH, USDC)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, USDC);

        const results = await oracle.getPrice(WETH, USDC);
        const price = results[0];
        const timestamp = results[1];
        console.log("getPrice(WETH, USDC) = %s (timestamp: %s)", price, timestamp);
    });

    it("Test getPrice(USDC, WETH)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, USDC);

        const results = await oracle.getPrice(USDC, WETH);
        const price = results[0];
        const timestamp = results[1];
        console.log("getPrice(USDC, WETH) = %s (timestamp: %s)", price, timestamp);
    });

    it("Test getPrice(WBTC, USDC)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, WBTC);

        const results = await oracle.getPrice(WBTC, USDC);
        const price = results[0];
        const timestamp = results[1];
        console.log("getPrice(WBTC, USDC) = %s (timestamp: %s)", price, timestamp);
    });

    it("Test getPrice(USDC, WBTC)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, WBTC);

        const results = await oracle.getPrice(USDC, WBTC);
        const price = results[0];
        const timestamp = results[1];
        console.log("getPrice(USDC, WBTC) = %s (timestamp: %s)", price, timestamp);
    });

    it("Test getPrice(AGIX, USDC)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, AGIX);

        const results = await oracle.getPrice(AGIX, USDC);
        const price = results[0];
        const timestamp = results[1];
        console.log("getPrice(AGIX, USDC) = %s (timestamp: %s)", price, timestamp);
    });

    it("Test getPrice(SDAO, USDC)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, SDAO);

        const results = await oracle.getPrice(SDAO, USDC);
        const price = results[0];
        const timestamp = results[1];
        console.log("getPrice(SDAO, USDC) = %s (timestamp: %s)", price, timestamp);
    });

    it("Test getPrice(NTX, USDC)", async () => {
        oracle = await usdcOracle_CF.deploy(chainlinkOracle.address, USDC);
        await waitForTx(await oracle.setFallbackOracles([uniswapv3Oracle.address, uniswapv2Oracle.address]));
        await updateOracle(uniswapv2Oracle, NTX);

        const results = await oracle.getPrice(NTX, USDC);
        const price = results[0];
        const timestamp = results[1];
        console.log("getPrice(NTX, USDC) = %s (timestamp: %s)", price, timestamp);
    });

  });
});

