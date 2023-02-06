// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

import {IDynaset} from "./interfaces/IDynaset.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IUniswapV2Router.sol";
import "./interfaces/IDynasetTvlOracle.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract DirectForge is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;
    /* ==========  Constants  ========== */

    bytes32 public constant BLACK_SMITH = keccak256(abi.encode("BLACK_SMITH"));

    address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    address public constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    uint256 public constant SLIPPAGE_FACTOR = 1000;
    uint256 public constant WITHDRAW_FEE_FACTOR = 10000;
    uint256 public constant WITHDRAW_FEE_5_PERCENT = 500;
    uint256 public constant WITHDRAW_FEE_4_PERCENT = 400;
    uint256 public constant WITHDRAW_FEE_2_5_PERCENT = 250;

    uint256 public constant WITHDRAW_FEE_5_PERCENT_PERIOD = 30 days;
    uint256 public constant WITHDRAW_FEE_4_PERCENT_PERIOD = 60 days;
    uint256 public constant WITHDRAW_FEE_2_5_PERCENT_PERIOD = 90 days;

    uint256 public constant USDC_DECIMALS = 6;
    uint256 public constant DYNASET_DECIMALS = 18;

    IDynaset public dynaset;
    IDynasetTvlOracle public dynasetTvlOracle;

    /* ==========  State  ========== */

    address public uniswapV2Router = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    bool public canInstantMint = false;
    bool public canInstantRedeem = false;
    uint256 public contribPeriodInstantRedeem;
    uint256 public totalFee;
    uint256 public deadline;
    uint256 public slippage = 50;

    /* ==========  Events  ========== */

    event DynasetsMinted(
        address indexed caller,
        address indexed user,
        uint256 amount
    );
    event DynasetsRedeemed(address indexed user, uint256 indexed amount);
    event MintEnabled(bool enabled);
    event RedeemEnabled(bool enabled);
    event OracleUpdated(address indexed oracle);
    event SetRedeemPeriod(uint256 indexed contribPeriodInstantRedeem);

    /* ==========  Constructor  ========== */

    constructor(
        address _blacksmith,
        address _dynaset,
        address _dynasetTvlOracle
    ) {
        require(
            _blacksmith != address(0) &&
                _dynaset != address(0) &&
                _dynasetTvlOracle != address(0),
            "ERR_ZERO_ADDRESS"
        );
        _setupRole(BLACK_SMITH, _blacksmith);
        dynaset = IDynaset(_dynaset);
        dynasetTvlOracle = IDynasetTvlOracle(_dynasetTvlOracle);
    }

    /* ==========  External Functions  ========== */

    //  Mints equivalent dynasets to the _to address, the USD equivalent us
    // calaulated using the dynasetTvlOracle contract
    // and the No of dynasets minted is calculated using the dynaset USD value.
    // the funds are immidiatly sent to the dynasets.
    function instantMint(
        uint256 contributionAmount,
        address contributionToken,
        address to,
        uint256 minimumAmountOut
    ) external nonReentrant {
        require(to != address(0), "ERR_ZERO_ADDRESS");
        require(contributionAmount > 0, "ERR_ZERO_AMOUNT");
        require(canInstantMint, "ERR_DIRECTMINT_DISABLED");
        require(
            IERC20(contributionToken).balanceOf(msg.sender) >= contributionAmount,
            "NOT_ENOUGH_FUNDS"
        );
        // transfer contribution from user wallet to DirectForge
        IERC20(contributionToken).safeTransferFrom(msg.sender, address(this), contributionAmount);
        // calculate contribution USDC value
        uint256 contributionUsdcValue = dynasetTvlOracle.tokenUsdcValue(contributionToken, contributionAmount);
        // collect dynaset token USDC ratios
        address[] memory tokens;
        uint256[] memory ratios;
        uint256 totalUSDC;
        (tokens, ratios, totalUSDC) = dynasetTvlOracle.dynasetTokenUsdcRatios();
        // swap contribution tokens to dynaset tokens
        for (uint256 i = 0; i < tokens.length; i++) {
            address token = tokens[i];
            uint256 amountIn = contributionAmount * ratios[i] / 1e18;
            uint256 amountOut;
            if (token == contributionToken) {
                amountOut = amountIn;
            } else {
                address _contributionToken = contributionToken; // avoid stack too deep
                bool routeOverWeth = (_contributionToken != WETH && token != WETH);
                uint256 pathLength = routeOverWeth ? 3 : 2;
                address[] memory path = new address[](pathLength);
                path[0] = _contributionToken;
                if (routeOverWeth) {
                    path[1] = WETH;
                }
                path[pathLength - 1] = token;
                 
                uint256[] memory amountsOut = IUniswapV2Router(uniswapV2Router).getAmountsOut(amountIn, path);
                amountOut = amountsOut[pathLength - 1];
                
                IERC20(_contributionToken).safeIncreaseAllowance(uniswapV2Router, amountIn);
                require(
                    IUniswapV2Router(uniswapV2Router)
                        .swapExactTokensForTokens(
                            amountIn,
                            amountOut * (SLIPPAGE_FACTOR - slippage) / SLIPPAGE_FACTOR,
                            path,
                            address(this),
                            block.timestamp + deadline
                        )
                        .length == path.length,
                    "ERR_SWAP_FAILED"
                );
            }
            IERC20(token).safeIncreaseAllowance(address(dynaset), amountOut);
        }
        // calculate shares to mint
        uint256 totalSupply = dynaset.totalSupply();
        uint256 sharesToMint = contributionUsdcValue * totalSupply / totalUSDC;
        // dynaset minting
        uint256 dynasetsMinted = dynaset.joinDynaset(sharesToMint);
        require(dynasetsMinted >= minimumAmountOut, "ERR_MINIMUM_AMOUNT_OUT");
        require(dynaset.transfer(to, dynasetsMinted), "ERR_TRANSFER_FAILED");
        emit DynasetsMinted(msg.sender, to, dynasetsMinted);
    }

    function withdrawFee() external onlyRole(BLACK_SMITH) {
        require(
            dynaset.balanceOf(address(this)) >= totalFee,
            "ERR_INSUFFICIENT_BALANCE"
        );
        uint256 feeToRedeem = totalFee;
        totalFee = 0;
        require(
            dynaset.transfer(msg.sender, feeToRedeem),
            "ERR_TRANSFER_FAILED"
        );
    }

    //  Redeems the _amount of dynasets from the _from address
    // Funds are taken directly form dynasets.
    // the funds are converted to _asset using uniswap before sending to caller.
    function instantRedeem(
        uint256 dynasetAmount,
        address asset,
        uint256 minimumAmountOut
    ) external nonReentrant {
        // only active boolean
        require(canInstantRedeem, "ERR_INSTANTREDEEM_DISABLED");
        // add capital slash if not exit period
        require(
            dynaset.balanceOf(msg.sender) >= dynasetAmount,
            "Insufficient Dynasets"
        );
        uint256 capitalSlashed = capitalSlash(
            dynasetAmount,
            contribPeriodInstantRedeem
        );

        totalFee = totalFee + (dynasetAmount - capitalSlashed);
        require(
            dynaset.transferFrom(msg.sender, address(this), dynasetAmount),
            "ERR_TRANSFERFROM_FAILED"
        );
        (address[] memory tokens, uint256[] memory amounts) = dynaset
            .calcTokensForAmount(capitalSlashed);

        dynaset.exitDynaset(capitalSlashed);

        uint256 amountOut = 0;
        //check if enough tokens for swap
        for (uint256 i = 0; i < tokens.length; i++) {
            address tokenOut = tokens[i];
            uint256 amountIn = amounts[i];

            if (tokenOut == asset) {
                require(
                    IERC20(asset).balanceOf(address(this)) >= amountIn,
                    "ERR_INSUFFICIENT_BALANCE"
                );
                IERC20(asset).safeTransfer(msg.sender, amountIn);
                amountOut += amountIn;
            } else {
                uint8 pathLength;
                if (tokenOut != WETH && asset != WETH) {
                    pathLength = 3;
                } else {
                    pathLength = 2;
                }
                address[] memory path;
                path = new address[](pathLength);
                path[0] = tokenOut;

                if (tokenOut != WETH && asset != WETH) {
                    path[1] = WETH;
                    path[2] = asset;
                } else {
                    path[1] = asset;
                }
                require(
                    IERC20(tokenOut).balanceOf(address(this)) >= amountIn,
                    "ERR_INSUFFICIENT_BALANCE"
                );
                IERC20(tokenOut).safeIncreaseAllowance(
                    uniswapV2Router,
                    amountIn
                );
                uint256[] memory amountInMax = IUniswapV2Router(uniswapV2Router)
                    .getAmountsOut(amountIn, path);
                //then we will call swapExactTokensForTokens
                //for the deadline we will pass in block.timestamp + deadline
                //the deadline is the latest time the trade is valid for
                uint256[] memory amountsOut = IUniswapV2Router(uniswapV2Router)
                    .swapExactTokensForTokens(
                        amountIn,
                        (amountInMax[pathLength - 1] *
                            (SLIPPAGE_FACTOR - slippage)) / SLIPPAGE_FACTOR,
                        path,
                        msg.sender,
                        block.timestamp + deadline
                    );
                require(amountsOut.length == path.length, "ERR_SWAP_FAILED");
                amountOut += amountsOut[amountsOut.length - 1];
            }
        }
        require(amountOut >= minimumAmountOut, "ERR_MINIMUM_AMOUNT_OUT");
        emit DynasetsRedeemed(msg.sender, dynasetAmount);
    }

    function setInstantMint(bool status) external onlyRole(BLACK_SMITH) {
        canInstantMint = status;
        emit MintEnabled(status);
    }

    function setInstantRedeem(bool status) external onlyRole(BLACK_SMITH) {
        canInstantRedeem = status;
        emit RedeemEnabled(status);
    }

    function setRedeemPeriod(uint256 value) external onlyRole(BLACK_SMITH) {
        contribPeriodInstantRedeem = value;
        emit SetRedeemPeriod(contribPeriodInstantRedeem);
    }

    function setDeadline(uint256 newDeadline) external onlyRole(BLACK_SMITH) {
        deadline = newDeadline;
    }

    function upgradeUniswapV2Router(address newUniswapV2Router)
        external
        onlyRole(BLACK_SMITH)
    {
        require(newUniswapV2Router != address(0), "ERR_ADDRESS_ZERO");
        uniswapV2Router = newUniswapV2Router;
    }

    function updateOracle(address newDynasetTvlOracle)
        external
        onlyRole(BLACK_SMITH)
    {
        dynasetTvlOracle = IDynasetTvlOracle(newDynasetTvlOracle);
        emit OracleUpdated(newDynasetTvlOracle);
    }

    function setSlippage(uint256 newSlippage) external onlyRole(BLACK_SMITH) {
        require(newSlippage < (SLIPPAGE_FACTOR / 2), "SLIPPAGE_TOO_LARGE");
        slippage = newSlippage;
    }

    /* ==========  Public Functions  ========== */

    // withdrawal fee calculation based on contribution time
    // 0-30 days 5%
    // 31-60 days 4%
    // 61 - 90 days 2.5%
    // above 91 days 0%
    function capitalSlash(uint256 amount, uint256 contributionTime) public view returns (uint256) {
        uint256 currentTime = block.timestamp;
        if ((contributionTime <= currentTime)
        && (currentTime < contributionTime + WITHDRAW_FEE_5_PERCENT_PERIOD)) {
            return amount * (WITHDRAW_FEE_FACTOR - WITHDRAW_FEE_5_PERCENT) / WITHDRAW_FEE_FACTOR;
        }
        if ((contributionTime + WITHDRAW_FEE_5_PERCENT_PERIOD <= currentTime) 
        && (currentTime < contributionTime + WITHDRAW_FEE_4_PERCENT_PERIOD)) {
            return amount * (WITHDRAW_FEE_FACTOR - WITHDRAW_FEE_4_PERCENT) / WITHDRAW_FEE_FACTOR;
        }
        if ((contributionTime + WITHDRAW_FEE_4_PERCENT_PERIOD <= currentTime) 
        && (currentTime < contributionTime + WITHDRAW_FEE_2_5_PERCENT_PERIOD)) {
            return amount * (WITHDRAW_FEE_FACTOR - WITHDRAW_FEE_2_5_PERCENT) / WITHDRAW_FEE_FACTOR;
        }
        return amount;
    }
}
