const { expect } = require("chai");
const { waffle, ethers } = require('hardhat');
const { deployMockContract, provider } = waffle;
const BigNumber = require("bignumber.js");

// vars
const tx_options = {gasLimit:80000000, gasPrice: 50000000000};
const nothing = 0;
const zero_address = "0x0000000000000000000000000000000000000000";

const gnosis_safe_address = '0x9508232030c3e9F9a1Dcf8AfdbF0150e73226763';
const dynaset_name = "Dynaset Name";
const dynaset_symbol = "DS";

const ONE_USDC = "1000000";
const ONE_WBTC = "100000000";
const HALF_WBTC = "50000000";

function address2bytes32(address) {
   return ethers.utils.hexlify(address).replaceAll("0x","0x000000000000000000000000");
}

function address2uint256(address) {
   return ethers.utils.hexlify(address);
}

describe("Dynaset contract", function () {
    beforeEach(async () => {
        [deployer, digitalAssetManager, controller, dynasetFactory] = provider.getWallets();
        dynaset_CF = await ethers.getContractFactory("Dynaset");
        ERC20 = require('../artifacts/contracts/interfaces/IERC20.sol/IERC20.json');
        IUniswapV2Pair = require('../artifacts/contracts/interfaces/IUniswapV2Pair.sol/IUniswapV2Pair.json');
    });

    describe("Deployment of Dynaset", () => {
        it("Should fail when passed dynasetFactory address is zero", async () => {
            expect(dynaset_CF.deploy(zero_address, digitalAssetManager.address, controller.address, dynaset_name, dynaset_symbol, tx_options))
                .to.be.revertedWith("ERR_ZERO_ADDRESS");
        });
        it("Should fail when passed digital asset manager address is zero", async () => {
            expect(dynaset_CF.deploy(dynasetFactory.address, zero_address, controller.address, dynaset_name, dynaset_symbol, tx_options))
                .to.be.revertedWith("ERR_ZERO_ADDRESS");
        });
        it("Should fail when passed controller address is zero", async () => {
            expect(dynaset_CF.deploy(dynasetFactory.address, digitalAssetManager.address, zero_address, dynaset_name, dynaset_symbol, tx_options))
                .to.be.revertedWith("ERR_ZERO_ADDRESS");
        });
        it("Should set name and symbol correctly", async () => {
            dynaset = await dynaset_CF.deploy(dynasetFactory.address, digitalAssetManager.address, controller.address, dynaset_name, dynaset_symbol, tx_options);
            expect(await dynaset.name())
                .to.be.equal(dynaset_name);
            expect(await dynaset.symbol())
                .to.be.equal(dynaset_symbol);
        });
        it("Should bind tokens correctly after initialize", async () => {
            const dynaset = await dynaset_CF.deploy(dynasetFactory.address, digitalAssetManager.address, controller.address, dynaset_name, dynaset_symbol, tx_options);
            const WETH = await deployMockContract(deployer, ERC20.abi);
            const USDC = await deployMockContract(deployer, ERC20.abi);
            const WBTC = await deployMockContract(deployer, ERC20.abi);
            await USDC.mock.transferFrom.returns(true);
            await WBTC.mock.transferFrom.returns(true);

            await dynaset.connect(dynasetFactory).initialize([USDC.address, WBTC.address], [ONE_USDC, ONE_WBTC], deployer.address);

            expect(await dynaset.isBound(WETH.address))
                .to.be.false;
            expect(await dynaset.isBound(USDC.address))
                .to.be.true;
            expect(await dynaset.isBound(WBTC.address))
                .to.be.true;
        });
        it("Should calcTokensForAmount correctly after initialize", async () => {
            const dynaset = await dynaset_CF.deploy(dynasetFactory.address, digitalAssetManager.address, controller.address, dynaset_name, dynaset_symbol, tx_options);
            const WETH = await deployMockContract(deployer, ERC20.abi);
            const USDC = await deployMockContract(deployer, ERC20.abi);
            const WBTC = await deployMockContract(deployer, ERC20.abi);
            await USDC.mock.transferFrom.returns(true);
            await WBTC.mock.transferFrom.returns(true);

            await dynaset.connect(dynasetFactory).initialize([USDC.address, WBTC.address], [ONE_USDC, ONE_WBTC], deployer.address);

            const HUNDRED_SHARES = new BigNumber(100e18).toFixed();
            const [tokens, amounts] = await dynaset.calcTokensForAmount(HUNDRED_SHARES);
            expect(tokens)
                .to.have.ordered.members([USDC.address, WBTC.address]);
            expect(amounts.map((amount) => new BigNumber(amount.toString()).toFixed()))
                .to.have.ordered.members([ONE_USDC, ONE_WBTC]);
        });
        it("Calling swapUniswap should fail when not called by the digital asset manager", async () => {
            const dynaset = await dynaset_CF.deploy(dynasetFactory.address, digitalAssetManager.address, controller.address, dynaset_name, dynaset_symbol, tx_options);
            const USDC = await deployMockContract(deployer, ERC20.abi);
            const WBTC = await deployMockContract(deployer, ERC20.abi);

            expect(dynaset.connect(dynasetFactory).swapUniswap(WBTC.address, USDC.address, HALF_WBTC, nothing))
                .to.be.revertedWith('ERR_NOT_DAM');
        });
        it("Calling swapUniswap should fail when input token is not bound", async () => {
            const dynaset = await dynaset_CF.deploy(dynasetFactory.address, digitalAssetManager.address, controller.address, dynaset_name, dynaset_symbol, tx_options);
            const WETH = await deployMockContract(deployer, ERC20.abi);
            const USDC = await deployMockContract(deployer, ERC20.abi);
            const WBTC = await deployMockContract(deployer, ERC20.abi);
            await USDC.mock.transferFrom.returns(true);
            await WBTC.mock.transferFrom.returns(true);
            await dynaset.connect(dynasetFactory).initialize([USDC.address, WBTC.address], [ONE_USDC, ONE_WBTC], deployer.address);

            expect(dynaset.connect(digitalAssetManager).swapUniswap(WETH.address, USDC.address, HALF_WBTC, nothing))
                .to.be.revertedWith('ERR_NOT_BOUND');
        });
        it("Calling swapUniswap should fail when output token is not bound", async () => {
            const dynaset = await dynaset_CF.deploy(dynasetFactory.address, digitalAssetManager.address, controller.address, dynaset_name, dynaset_symbol, tx_options);
            const WETH = await deployMockContract(deployer, ERC20.abi);
            const USDC = await deployMockContract(deployer, ERC20.abi);
            const WBTC = await deployMockContract(deployer, ERC20.abi);
            await USDC.mock.transferFrom.returns(true);
            await WBTC.mock.transferFrom.returns(true);
            await dynaset.connect(dynasetFactory).initialize([USDC.address, WBTC.address], [ONE_USDC, ONE_WBTC], deployer.address);

            expect(dynaset.connect(digitalAssetManager).swapUniswap(WBTC.address, WETH.address, HALF_WBTC, nothing))
                .to.be.revertedWith('ERR_NOT_BOUND');
        });
        it("Calling swapOneInch should fail when not called by the digital asset manager", async () => {
            const dynaset = await dynaset_CF.deploy(dynasetFactory.address, digitalAssetManager.address, controller.address, dynaset_name, dynaset_symbol, tx_options);
            const USDC = await deployMockContract(deployer, ERC20.abi);
            const WBTC = await deployMockContract(deployer, ERC20.abi);
            const WBTC_USDC_LP = await deployMockContract(deployer, IUniswapV2Pair.abi);
            const pools = [address2bytes32(WBTC_USDC_LP.address)];
            
            expect(dynaset.connect(dynasetFactory).swapOneInch(WBTC.address, USDC.address, HALF_WBTC, nothing, pools))
                .to.be.revertedWith('ERR_NOT_DAM');
        });
        it("Calling swapOneInch should fail when input token is not bound", async () => {
            const dynaset = await dynaset_CF.deploy(dynasetFactory.address, digitalAssetManager.address, controller.address, dynaset_name, dynaset_symbol, tx_options);
            const WETH = await deployMockContract(deployer, ERC20.abi);
            const USDC = await deployMockContract(deployer, ERC20.abi);
            const WBTC = await deployMockContract(deployer, ERC20.abi);
            await USDC.mock.transferFrom.returns(true);
            await WBTC.mock.transferFrom.returns(true);
            await dynaset.connect(dynasetFactory).initialize([USDC.address, WBTC.address], [ONE_USDC, ONE_WBTC], deployer.address);
            const WBTC_USDC_LP = await deployMockContract(deployer, IUniswapV2Pair.abi);
            const pools = [address2bytes32(WBTC_USDC_LP.address)];

            expect(dynaset.connect(digitalAssetManager).swapOneInch(WETH.address, USDC.address, HALF_WBTC, nothing, pools))
                .to.be.revertedWith('ERR_NOT_BOUND');
        });
        it("Calling swapOneInch should fail when output token is not bound", async () => {
            const dynaset = await dynaset_CF.deploy(dynasetFactory.address, digitalAssetManager.address, controller.address, dynaset_name, dynaset_symbol, tx_options);
            const WETH = await deployMockContract(deployer, ERC20.abi);
            const USDC = await deployMockContract(deployer, ERC20.abi);
            const WBTC = await deployMockContract(deployer, ERC20.abi);
            await USDC.mock.transferFrom.returns(true);
            await WBTC.mock.transferFrom.returns(true);
            await dynaset.connect(dynasetFactory).initialize([USDC.address, WBTC.address], [ONE_USDC, ONE_WBTC], deployer.address);
            const WBTC_USDC_LP = await deployMockContract(deployer, IUniswapV2Pair.abi);
            const pools = [address2bytes32(WBTC_USDC_LP.address)];

            expect(dynaset.connect(digitalAssetManager).swapOneInch(WBTC.address, WETH.address, HALF_WBTC, nothing, pools))
                .to.be.revertedWith('ERR_NOT_BOUND');
        });
        it("Calling swapOneInch should fail when passed pools output token is not same as output token", async () => {
            const dynaset = await dynaset_CF.deploy(dynasetFactory.address, digitalAssetManager.address, controller.address, dynaset_name, dynaset_symbol, tx_options);
            const WETH = await deployMockContract(deployer, ERC20.abi);
            const USDC = await deployMockContract(deployer, ERC20.abi);
            const WBTC = await deployMockContract(deployer, ERC20.abi);
            await USDC.mock.transferFrom.returns(true);
            await WBTC.mock.transferFrom.returns(true);
            await dynaset.connect(dynasetFactory).initialize([USDC.address, WBTC.address], [ONE_USDC, ONE_WBTC], deployer.address);
            const WBTC_WETH_LP = await deployMockContract(deployer, IUniswapV2Pair.abi);
            await WBTC_WETH_LP.mock.token0.returns(WBTC.address);
            await WBTC_WETH_LP.mock.token1.returns(WETH.address);
            const pools = [address2bytes32(WBTC_WETH_LP.address)];

            expect(dynaset.connect(digitalAssetManager).swapOneInch(WBTC.address, USDC.address, HALF_WBTC, nothing, pools))
                .to.be.revertedWith('ERR_OUTPUT_TOKEN');
        });
        it("Calling swapOneInch should fail when input token is missing in passed pools", async () => {
            const dynaset = await dynaset_CF.deploy(dynasetFactory.address, digitalAssetManager.address, controller.address, dynaset_name, dynaset_symbol, tx_options);
            const WETH = await deployMockContract(deployer, ERC20.abi);
            const USDC = await deployMockContract(deployer, ERC20.abi);
            const WBTC = await deployMockContract(deployer, ERC20.abi);
            await USDC.mock.transferFrom.returns(true);
            await WBTC.mock.transferFrom.returns(true);
            await dynaset.connect(dynasetFactory).initialize([USDC.address, WBTC.address], [ONE_USDC, ONE_WBTC], deployer.address);
            const USDC_WETH_LP = await deployMockContract(deployer, IUniswapV2Pair.abi);
            await USDC_WETH_LP.mock.token0.returns(USDC.address);
            await USDC_WETH_LP.mock.token1.returns(WETH.address);
            const pools = [address2bytes32(USDC_WETH_LP.address)];

            expect(dynaset.connect(digitalAssetManager).swapOneInch(WBTC.address, USDC.address, HALF_WBTC, nothing, pools))
                .to.be.revertedWith('ERR_TOKEN_MISSING_IN_PAIR');
        });
        it("Calling swapOneInchUniV3 should fail when not called by the digital asset manager", async () => {
            const dynaset = await dynaset_CF.deploy(dynasetFactory.address, digitalAssetManager.address, controller.address, dynaset_name, dynaset_symbol, tx_options);
            const USDC = await deployMockContract(deployer, ERC20.abi);
            const WBTC = await deployMockContract(deployer, ERC20.abi);
            const WBTC_USDC_LP = await deployMockContract(deployer, IUniswapV2Pair.abi);
            const pools = [address2uint256(WBTC_USDC_LP.address)];
            
            expect(dynaset.connect(dynasetFactory).swapOneInchUniV3(WBTC.address, USDC.address, HALF_WBTC, nothing, pools))
                .to.be.revertedWith('ERR_NOT_DAM');
        });
        it("Calling swapOneInchUniV3 should fail when input token is not bound", async () => {
            const dynaset = await dynaset_CF.deploy(dynasetFactory.address, digitalAssetManager.address, controller.address, dynaset_name, dynaset_symbol, tx_options);
            const WETH = await deployMockContract(deployer, ERC20.abi);
            const USDC = await deployMockContract(deployer, ERC20.abi);
            const WBTC = await deployMockContract(deployer, ERC20.abi);
            await USDC.mock.transferFrom.returns(true);
            await WBTC.mock.transferFrom.returns(true);
            await dynaset.connect(dynasetFactory).initialize([USDC.address, WBTC.address], [ONE_USDC, ONE_WBTC], deployer.address);
            const WBTC_USDC_LP = await deployMockContract(deployer, IUniswapV2Pair.abi);
            const pools = [address2uint256(WBTC_USDC_LP.address)];

            expect(dynaset.connect(digitalAssetManager).swapOneInchUniV3(WETH.address, USDC.address, HALF_WBTC, nothing, pools))
                .to.be.revertedWith('ERR_NOT_BOUND');
        });
        it("Calling swapOneInchUniV3 should fail when output token is not bound", async () => {
            const dynaset = await dynaset_CF.deploy(dynasetFactory.address, digitalAssetManager.address, controller.address, dynaset_name, dynaset_symbol, tx_options);
            const WETH = await deployMockContract(deployer, ERC20.abi);
            const USDC = await deployMockContract(deployer, ERC20.abi);
            const WBTC = await deployMockContract(deployer, ERC20.abi);
            await USDC.mock.transferFrom.returns(true);
            await WBTC.mock.transferFrom.returns(true);
            await dynaset.connect(dynasetFactory).initialize([USDC.address, WBTC.address], [ONE_USDC, ONE_WBTC], deployer.address);
            const WBTC_USDC_LP = await deployMockContract(deployer, IUniswapV2Pair.abi);
            const pools = [address2uint256(WBTC_USDC_LP.address)];

            expect(dynaset.connect(digitalAssetManager).swapOneInchUniV3(WBTC.address, WETH.address, HALF_WBTC, nothing, pools))
                .to.be.revertedWith('ERR_NOT_BOUND');
        });
        it("Calling swapOneInchUniV3 should fail when passed pools output token is not same as output token", async () => {
            const dynaset = await dynaset_CF.deploy(dynasetFactory.address, digitalAssetManager.address, controller.address, dynaset_name, dynaset_symbol, tx_options);
            const WETH = await deployMockContract(deployer, ERC20.abi);
            const USDC = await deployMockContract(deployer, ERC20.abi);
            const WBTC = await deployMockContract(deployer, ERC20.abi);
            await USDC.mock.transferFrom.returns(true);
            await WBTC.mock.transferFrom.returns(true);
            await dynaset.connect(dynasetFactory).initialize([USDC.address, WBTC.address], [ONE_USDC, ONE_WBTC], deployer.address);
            const WBTC_WETH_LP = await deployMockContract(deployer, IUniswapV2Pair.abi);
            await WBTC_WETH_LP.mock.token0.returns(WBTC.address);
            await WBTC_WETH_LP.mock.token1.returns(WETH.address);
            const pools = [address2uint256(WBTC_WETH_LP.address)];

            expect(dynaset.connect(digitalAssetManager).swapOneInchUniV3(WBTC.address, USDC.address, HALF_WBTC, nothing, pools))
                .to.be.revertedWith('ERR_OUTPUT_TOKEN');
        });
        it("Calling swapOneInchUniV3 should fail when input token is missing in passed pools", async () => {
            const dynaset = await dynaset_CF.deploy(dynasetFactory.address, digitalAssetManager.address, controller.address, dynaset_name, dynaset_symbol, tx_options);
            const WETH = await deployMockContract(deployer, ERC20.abi);
            const USDC = await deployMockContract(deployer, ERC20.abi);
            const WBTC = await deployMockContract(deployer, ERC20.abi);
            await USDC.mock.transferFrom.returns(true);
            await WBTC.mock.transferFrom.returns(true);
            await dynaset.connect(dynasetFactory).initialize([USDC.address, WBTC.address], [ONE_USDC, ONE_WBTC], deployer.address);
            const USDC_WETH_LP = await deployMockContract(deployer, IUniswapV2Pair.abi);
            await USDC_WETH_LP.mock.token0.returns(USDC.address);
            await USDC_WETH_LP.mock.token1.returns(WETH.address);
            const pools = [address2uint256(USDC_WETH_LP.address)];

            expect(dynaset.connect(digitalAssetManager).swapOneInchUniV3(WBTC.address, USDC.address, HALF_WBTC, nothing, pools))
                .to.be.revertedWith('ERR_TOKEN_MISSING_IN_PAIR');
        });
        
    });
});


