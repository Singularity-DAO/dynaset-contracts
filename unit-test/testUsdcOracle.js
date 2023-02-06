const { expect } = require("chai");
const { waffle, ethers } = require('hardhat');
const { deployMockContract, provider } = waffle;

const ERC20 = require('../artifacts/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol/IERC20Metadata.json');
const IUsdcOracle = require('../artifacts/contracts/interfaces/IUsdcOracle.sol/IUsdcOracle.json');
const zero_address  = "0x0000000000000000000000000000000000000000";

const ONE_USDC = "1000000";
const ONE_WBTC = "100000000";

var admin, user;
var usdcOracle_CF;
var USDC, WBTC;
var mainOracle, fallbackOracle, fallbackOracle2;

async function now() {
   return (await ethers.provider.getBlock("latest")).timestamp;
}

describe("UsdcOracle contract", function () {
  beforeEach(async () => {
      [admin, user, _] = await ethers.getSigners();
      usdcOracle_CF = await ethers.getContractFactory("UsdcOracle");
      USDC = await deployMockContract(admin, ERC20.abi);
      WBTC = await deployMockContract(admin, ERC20.abi);
      mainOracle = await deployMockContract(admin, IUsdcOracle.abi);
      fallbackOracle =  await deployMockContract(admin, IUsdcOracle.abi);
      fallbackOracle2 =  await deployMockContract(admin, IUsdcOracle.abi);
  });

  describe("Deployment of UsdcOracle", () => {
    it("Should set preferred oracle and USDC addresses", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);
       
        expect(await usdcOracle.preferredOracle())
            .to.equal(mainOracle.address);
        expect(await usdcOracle.USDC())
            .to.equal(USDC.address);
    });
    it("Non-admin should not be able to pause preferred oracle", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);

        expect(await usdcOracle.paused(mainOracle.address))
            .to.be.false;
        const oracle_admin_role = await usdcOracle.ORACLE_ADMIN();
        await expect(usdcOracle.connect(user).setPaused(mainOracle.address, true))
            .to.be.revertedWith("AccessControl: account "+user.address.toLowerCase()+" is missing role "+oracle_admin_role);
    });
    it("Admin should be able to pause preferred oracle", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);

        await usdcOracle.connect(admin).setPaused(mainOracle.address, true);

        expect(await usdcOracle.paused(mainOracle.address))
            .to.be.true;
    });
    it("Admin should be able to set fallback oracles", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);

        await usdcOracle.connect(admin).setFallbackOracles([fallbackOracle.address]);
        
        expect(await usdcOracle.fallbackOracles(0))
            .to.be.equal(fallbackOracle.address);
    });
    it("Non-admin should not be able to set fallback oracles", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);

        const oracle_admin_role = await usdcOracle.ORACLE_ADMIN();
        await expect(usdcOracle.connect(user).setFallbackOracles([fallbackOracle.address]))
            .to.be.revertedWith("AccessControl: account "+user.address.toLowerCase()+" is missing role "+oracle_admin_role);
    });
    it("Admin should be able to setStaleOraclePeriod", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);
        const one_day = 60*60*24;
        const default_stale_oracle_period = 2 * one_day;

        expect(await usdcOracle.staleOraclePeriod())
            .to.be.equal(default_stale_oracle_period);
            
        await usdcOracle.connect(admin).setStaleOraclePeriod(one_day);
        
        expect(await usdcOracle.staleOraclePeriod())
            .to.be.equal(one_day);
    });
    it("Non-admin should not be able to setStaleOraclePeriod", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);
        const one_day = 60*60*24;

        const oracle_admin_role = await usdcOracle.ORACLE_ADMIN();
        await expect(usdcOracle.connect(user).setStaleOraclePeriod(one_day))
            .to.be.revertedWith("AccessControl: account "+user.address.toLowerCase()+" is missing role "+oracle_admin_role);
    });
    it("Deploy of UsdcOracle should have non-zero preferred oracle address", async () => {
        await expect(usdcOracle_CF.deploy(zero_address, USDC.address))
            .to.be.revertedWith("ERR_PREFERRED_ORACLE_INIT");
    });
    it("Deploy of UsdcOracle should have non-zero USDC address", async () => {
        await expect(usdcOracle_CF.deploy(mainOracle.address, zero_address))
            .to.be.revertedWith("ERR_USDC_INIT");
    });
    it("canUpdateTokenPrices should return true", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);

        expect(await usdcOracle.canUpdateTokenPrices())
            .to.be.true;
    });
    it("updateTokenPrices should call updateTokenPrices on the fallback oracle when it can", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);
        await fallbackOracle.mock.canUpdateTokenPrices.returns(true);
        await fallbackOracle.mock.updateTokenPrices.returns([true]);
        await usdcOracle.connect(admin).setFallbackOracles([fallbackOracle.address]);

        await usdcOracle.updateTokenPrices([USDC.address]);
    });
    it("updateTokenPrices should not call updateTokenPrices on the fallback oracle when it can't", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);
        await fallbackOracle.mock.canUpdateTokenPrices.returns(false);
        await usdcOracle.connect(admin).setFallbackOracles([fallbackOracle.address]);

        await usdcOracle.updateTokenPrices([USDC.address]);
    });
    it("tokenUsdcValue should not call preferred oracle for USDC", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);
        await usdcOracle.connect(admin).setFallbackOracles([fallbackOracle.address]);

        const returnValues = await usdcOracle.tokenUsdcValue(USDC.address, ONE_USDC);
        const current_timestamp = await now();       
        const value = returnValues[0];
        const timestamp = returnValues[1];
        
        expect(value)
            .to.be.equal(ONE_USDC*1);
        expect(timestamp)
            .to.be.equal(current_timestamp);
    });
    it("tokenUsdcValue should call preferred oracle for non-USDC", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);
        const BTC_PRICE = 42069000000;
        const ORACLE_OBSERVATION = (await now() - 60);
        await mainOracle.mock.tokenUsdcValue.returns(BTC_PRICE, ORACLE_OBSERVATION);
        await usdcOracle.connect(admin).setFallbackOracles([fallbackOracle.address]);

        const returnValues = await usdcOracle.tokenUsdcValue(WBTC.address, ONE_WBTC);
        const value = returnValues[0];
        const timestamp = returnValues[1];
        
        expect(value)
            .to.be.equal(BTC_PRICE);
        expect(timestamp)
            .to.be.equal(ORACLE_OBSERVATION);
    });
    it("tokenUsdcValue should use fallback oracle for stale preferred oracle", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);
        const MAIN_BTC_PRICE = 42069000000;
        const MAIN_ORACLE_OBSERVATION = (await now() - 60*60*24*2);
        await mainOracle.mock.tokenUsdcValue.returns(MAIN_BTC_PRICE, MAIN_ORACLE_OBSERVATION);
        const FALLBACK_BTC_PRICE = 42042000000;
        const FALLBACK_ORACLE_OBSERVATION = (await now() - 60);
        await fallbackOracle.mock.tokenUsdcValue.returns(FALLBACK_BTC_PRICE, FALLBACK_ORACLE_OBSERVATION);
        await usdcOracle.connect(admin).setFallbackOracles([fallbackOracle.address]);

        const returnValues = await usdcOracle.tokenUsdcValue(WBTC.address, ONE_WBTC);
        const value = returnValues[0];
        const timestamp = returnValues[1];
        
        expect(value)
            .to.be.equal(FALLBACK_BTC_PRICE);
        expect(timestamp)
            .to.be.equal(FALLBACK_ORACLE_OBSERVATION);
    });
    it("tokenUsdcValue should use fallback oracle when preferred oracle throws error", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);
        await mainOracle.mock.tokenUsdcValue.revertsWithReason("ERR");
        const FALLBACK_BTC_PRICE = 42042000000;
        const FALLBACK_ORACLE_OBSERVATION = (await now() - 60);
        await fallbackOracle.mock.tokenUsdcValue.returns(FALLBACK_BTC_PRICE, FALLBACK_ORACLE_OBSERVATION);
        await usdcOracle.connect(admin).setFallbackOracles([fallbackOracle.address]);

        const returnValues = await usdcOracle.tokenUsdcValue(WBTC.address, ONE_WBTC);
        const value = returnValues[0];
        const timestamp = returnValues[1];
        
        expect(value)
            .to.be.equal(FALLBACK_BTC_PRICE);
        expect(timestamp)
            .to.be.equal(FALLBACK_ORACLE_OBSERVATION);
    });
    it("tokenUsdcValue should use fallback oracle when preferred oracle is paused", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);
        const MAIN_BTC_PRICE = 42069000000;
        const MAIN_ORACLE_OBSERVATION = (await now() - 60);
        await mainOracle.mock.tokenUsdcValue.returns(MAIN_BTC_PRICE, MAIN_ORACLE_OBSERVATION);
        const FALLBACK_BTC_PRICE = 42042000000;
        const FALLBACK_ORACLE_OBSERVATION = (await now() - 60);
        await fallbackOracle.mock.tokenUsdcValue.returns(FALLBACK_BTC_PRICE, FALLBACK_ORACLE_OBSERVATION);
        await usdcOracle.connect(admin).setFallbackOracles([fallbackOracle.address]);
        await usdcOracle.connect(admin).setPaused(mainOracle.address, true);

        const returnValues = await usdcOracle.tokenUsdcValue(WBTC.address, ONE_WBTC);
        const value = returnValues[0];
        const timestamp = returnValues[1];
        
        expect(value)
            .to.be.equal(FALLBACK_BTC_PRICE);
        expect(timestamp)
            .to.be.equal(FALLBACK_ORACLE_OBSERVATION);
    });
    it("tokenUsdcValue should use higest value fallback oracle for stale preferred oracle", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);
        const MAIN_BTC_PRICE = 42069000000;
        const MAIN_ORACLE_OBSERVATION = (await now() - 60*60*24*2);
        await mainOracle.mock.tokenUsdcValue.returns(MAIN_BTC_PRICE, MAIN_ORACLE_OBSERVATION);
        const FALLBACK_BTC_PRICE = 42042000000;
        const FALLBACK_ORACLE_OBSERVATION = (await now() - 60);
        await fallbackOracle.mock.tokenUsdcValue.returns(FALLBACK_BTC_PRICE, FALLBACK_ORACLE_OBSERVATION);
        const FALLBACK2_BTC_PRICE = 60042000000;
        const FALLBACK2_ORACLE_OBSERVATION = (await now() - 60*60);
        await fallbackOracle2.mock.tokenUsdcValue.returns(FALLBACK2_BTC_PRICE, FALLBACK2_ORACLE_OBSERVATION);
        await usdcOracle.connect(admin).setFallbackOracles([fallbackOracle.address, fallbackOracle2.address]);

        const returnValues = await usdcOracle.tokenUsdcValue(WBTC.address, ONE_WBTC);
        const value = returnValues[0];
        const timestamp = returnValues[1];
        
        expect(value)
            .to.be.equal(FALLBACK2_BTC_PRICE);
        expect(timestamp)
            .to.be.equal(FALLBACK2_ORACLE_OBSERVATION);
    });
    it("tokenUsdcValue should continue to next fallback oracle when oracle throws error", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);
        await mainOracle.mock.tokenUsdcValue.revertsWithReason("ERR");
        await fallbackOracle.mock.tokenUsdcValue.revertsWithReason("ERR");
        const FALLBACK2_BTC_PRICE = 60042000000;
        const FALLBACK2_ORACLE_OBSERVATION = (await now() - 60*60);
        await fallbackOracle2.mock.tokenUsdcValue.returns(FALLBACK2_BTC_PRICE, FALLBACK2_ORACLE_OBSERVATION);
        await usdcOracle.connect(admin).setFallbackOracles([fallbackOracle.address, fallbackOracle2.address]);

        const returnValues = await usdcOracle.tokenUsdcValue(WBTC.address, ONE_WBTC);
        const value = returnValues[0];
        const timestamp = returnValues[1];
        
        expect(value)
            .to.be.equal(FALLBACK2_BTC_PRICE);
        expect(timestamp)
            .to.be.equal(FALLBACK2_ORACLE_OBSERVATION);
    });
    it("tokenUsdcValue should continue to next fallback oracle when oracle is paused", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);
        const MAIN_BTC_PRICE = 42069000000;
        const MAIN_ORACLE_OBSERVATION = (await now() - 60);
        await mainOracle.mock.tokenUsdcValue.returns(MAIN_BTC_PRICE, MAIN_ORACLE_OBSERVATION);
        const FALLBACK_BTC_PRICE = 42042000000;
        const FALLBACK_ORACLE_OBSERVATION = (await now() - 60);
        await fallbackOracle.mock.tokenUsdcValue.returns(FALLBACK_BTC_PRICE, FALLBACK_ORACLE_OBSERVATION);
        const FALLBACK2_BTC_PRICE = 60042000000;
        const FALLBACK2_ORACLE_OBSERVATION = (await now() - 60*60);
        await fallbackOracle2.mock.tokenUsdcValue.returns(FALLBACK2_BTC_PRICE, FALLBACK2_ORACLE_OBSERVATION);
        await usdcOracle.connect(admin).setFallbackOracles([fallbackOracle.address, fallbackOracle2.address]);
        await usdcOracle.connect(admin).setPaused(mainOracle.address, true);
        await usdcOracle.connect(admin).setPaused(fallbackOracle.address, true);

        const returnValues = await usdcOracle.tokenUsdcValue(WBTC.address, ONE_WBTC);
        const value = returnValues[0];
        const timestamp = returnValues[1];
        
        expect(value)
            .to.be.equal(FALLBACK2_BTC_PRICE);
        expect(timestamp)
            .to.be.equal(FALLBACK2_ORACLE_OBSERVATION);
    });
    it("tokenUsdcValue should return ERR_STALE_ORACLE when all fallback oracles and preferred oracle are stale", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);
        const MAIN_BTC_PRICE = 42069000000;
        const MAIN_ORACLE_OBSERVATION = (await now() - 60*60*24*2);
        await mainOracle.mock.tokenUsdcValue.returns(MAIN_BTC_PRICE, MAIN_ORACLE_OBSERVATION);
        const FALLBACK_BTC_PRICE = 42042000000;
        const FALLBACK_ORACLE_OBSERVATION = (await now() - 60*60*24*2);
        await fallbackOracle.mock.tokenUsdcValue.returns(FALLBACK_BTC_PRICE, FALLBACK_ORACLE_OBSERVATION);
        const FALLBACK2_BTC_PRICE = 60042000000;
        const FALLBACK2_ORACLE_OBSERVATION = (await now() - 60*60*24*2);
        await fallbackOracle2.mock.tokenUsdcValue.returns(FALLBACK2_BTC_PRICE, FALLBACK2_ORACLE_OBSERVATION);
        await usdcOracle.connect(admin).setFallbackOracles([fallbackOracle.address, fallbackOracle2.address]);

        await expect(usdcOracle.tokenUsdcValue(WBTC.address, ONE_WBTC))
            .to.be.revertedWith("ERR_STALE_ORACLE");
    });
    it("getPrice(USDC, USDC) should return [1e6, block.timestamp]", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);
        await USDC.mock.decimals.returns(6);
        
        const returnValues = await usdcOracle.getPrice(USDC.address, USDC.address);
        const current_timestamp = await now();       
        const price = returnValues[0];
        const timestamp = returnValues[1];
        
        expect(price)
            .to.be.equal(1e6);
        expect(timestamp)
            .to.be.equal(current_timestamp);
    });
    it("getPrice(WBTC, USDC) should call preferred oracle", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);
        const MAIN_BTC_PRICE = 42069000000;
        const MAIN_ORACLE_OBSERVATION = (await now() - 60);
        await mainOracle.mock.getPrice.returns(MAIN_BTC_PRICE, MAIN_ORACLE_OBSERVATION);
        
        const returnValues = await usdcOracle.getPrice(WBTC.address, USDC.address);
        const price = returnValues[0];
        const timestamp = returnValues[1];
        
        expect(price)
            .to.be.equal(MAIN_BTC_PRICE);
        expect(timestamp)
            .to.be.equal(MAIN_ORACLE_OBSERVATION);
    });
    it("getPrice(WBTC, USDC) should call fallback oracle when preferred oracle is stale", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);
        const MAIN_BTC_PRICE = 42069000000;
        const MAIN_ORACLE_OBSERVATION = (await now() - 60*60*24*2);
        await mainOracle.mock.getPrice.returns(MAIN_BTC_PRICE, MAIN_ORACLE_OBSERVATION);
        const FALLBACK_BTC_PRICE = 42042000000;
        const FALLBACK_ORACLE_OBSERVATION = (await now() - 60);
        await fallbackOracle.mock.getPrice.returns(FALLBACK_BTC_PRICE, FALLBACK_ORACLE_OBSERVATION);
        await usdcOracle.connect(admin).setFallbackOracles([fallbackOracle.address]);
        
        const returnValues = await usdcOracle.getPrice(WBTC.address, USDC.address);
        const price = returnValues[0];
        const timestamp = returnValues[1];
        
        expect(price)
            .to.be.equal(FALLBACK_BTC_PRICE);
        expect(timestamp)
            .to.be.equal(FALLBACK_ORACLE_OBSERVATION);
    });
    it("getPrice(WBTC, USDC) should call fallback oracle when preferred oracle is paused", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);
        const MAIN_BTC_PRICE = 42069000000;
        const MAIN_ORACLE_OBSERVATION = (await now() - 60);
        await mainOracle.mock.getPrice.returns(MAIN_BTC_PRICE, MAIN_ORACLE_OBSERVATION);
        const FALLBACK_BTC_PRICE = 42042000000;
        const FALLBACK_ORACLE_OBSERVATION = (await now() - 60);
        await fallbackOracle.mock.getPrice.returns(FALLBACK_BTC_PRICE, FALLBACK_ORACLE_OBSERVATION);
        await usdcOracle.connect(admin).setPaused(mainOracle.address, true);
        await usdcOracle.connect(admin).setFallbackOracles([fallbackOracle.address]);
        
        const returnValues = await usdcOracle.getPrice(WBTC.address, USDC.address);
        const price = returnValues[0];
        const timestamp = returnValues[1];
        
        expect(price)
            .to.be.equal(FALLBACK_BTC_PRICE);
        expect(timestamp)
            .to.be.equal(FALLBACK_ORACLE_OBSERVATION);
    });
    it("getPrice(WBTC, USDC) should call fallback oracle when preferred oracle throws error", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);
        await mainOracle.mock.getPrice.revertsWithReason("ERR");
        const FALLBACK_BTC_PRICE = 42042000000;
        const FALLBACK_ORACLE_OBSERVATION = (await now() - 60);
        await fallbackOracle.mock.getPrice.returns(FALLBACK_BTC_PRICE, FALLBACK_ORACLE_OBSERVATION);
        await usdcOracle.connect(admin).setPaused(mainOracle.address, true);
        await usdcOracle.connect(admin).setFallbackOracles([fallbackOracle.address]);
        
        const returnValues = await usdcOracle.getPrice(WBTC.address, USDC.address);
        const price = returnValues[0];
        const timestamp = returnValues[1];
        
        expect(price)
            .to.be.equal(FALLBACK_BTC_PRICE);
        expect(timestamp)
            .to.be.equal(FALLBACK_ORACLE_OBSERVATION);
    });
    it("getPrice(WBTC, USDC) should call next fallback oracle when fallback oracle is stale", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);
        const MAIN_BTC_PRICE = 42069000000;
        const MAIN_ORACLE_OBSERVATION = (await now() - 60*60*24*2);
        await mainOracle.mock.getPrice.returns(MAIN_BTC_PRICE, MAIN_ORACLE_OBSERVATION);
        const FALLBACK_BTC_PRICE = 42042000000;
        const FALLBACK_ORACLE_OBSERVATION = (await now() - 60*60*24*2);
        await fallbackOracle.mock.getPrice.returns(FALLBACK_BTC_PRICE, FALLBACK_ORACLE_OBSERVATION);
        const FALLBACK2_BTC_PRICE = 69042000000;
        const FALLBACK2_ORACLE_OBSERVATION = (await now() - 60);
        await fallbackOracle2.mock.getPrice.returns(FALLBACK2_BTC_PRICE, FALLBACK2_ORACLE_OBSERVATION);
        await usdcOracle.connect(admin).setPaused(mainOracle.address, true);
        await usdcOracle.connect(admin).setFallbackOracles([fallbackOracle.address,fallbackOracle2.address]);
        
        const returnValues = await usdcOracle.getPrice(WBTC.address, USDC.address);
        const price = returnValues[0];
        const timestamp = returnValues[1];
        
        expect(price)
            .to.be.equal(FALLBACK2_BTC_PRICE);
        expect(timestamp)
            .to.be.equal(FALLBACK2_ORACLE_OBSERVATION);
    });
    it("getPrice(WBTC, USDC) should call next fallback oracle when fallback oracle is paused", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);
        const MAIN_BTC_PRICE = 42069000000;
        const MAIN_ORACLE_OBSERVATION = (await now() - 60);
        await mainOracle.mock.getPrice.returns(MAIN_BTC_PRICE, MAIN_ORACLE_OBSERVATION);
        const FALLBACK_BTC_PRICE = 42042000000;
        const FALLBACK_ORACLE_OBSERVATION = (await now() - 60);
        await fallbackOracle.mock.getPrice.returns(FALLBACK_BTC_PRICE, FALLBACK_ORACLE_OBSERVATION);
        const FALLBACK2_BTC_PRICE = 69042000000;
        const FALLBACK2_ORACLE_OBSERVATION = (await now() - 60);
        await fallbackOracle2.mock.getPrice.returns(FALLBACK2_BTC_PRICE, FALLBACK2_ORACLE_OBSERVATION);
        await usdcOracle.connect(admin).setPaused(mainOracle.address, true);
        await usdcOracle.connect(admin).setFallbackOracles([fallbackOracle.address,fallbackOracle2.address]);
        await usdcOracle.connect(admin).setPaused(mainOracle.address, true);
        await usdcOracle.connect(admin).setPaused(fallbackOracle.address, true);
        
        const returnValues = await usdcOracle.getPrice(WBTC.address, USDC.address);
        const price = returnValues[0];
        const timestamp = returnValues[1];
        
        expect(price)
            .to.be.equal(FALLBACK2_BTC_PRICE);
        expect(timestamp)
            .to.be.equal(FALLBACK2_ORACLE_OBSERVATION);
    });
    it("getPrice(WBTC, USDC) should call next fallback oracle when fallback oracle throws error", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);
        await mainOracle.mock.getPrice.revertsWithReason("ERR");
        await fallbackOracle.mock.getPrice.revertsWithReason("ERR");
        const FALLBACK2_BTC_PRICE = 69042000000;
        const FALLBACK2_ORACLE_OBSERVATION = (await now() - 60);
        await fallbackOracle2.mock.getPrice.returns(FALLBACK2_BTC_PRICE, FALLBACK2_ORACLE_OBSERVATION);
        await usdcOracle.connect(admin).setPaused(mainOracle.address, true);
        await usdcOracle.connect(admin).setFallbackOracles([fallbackOracle.address,fallbackOracle2.address]);
        await usdcOracle.connect(admin).setPaused(mainOracle.address, true);
        await usdcOracle.connect(admin).setPaused(fallbackOracle.address, true);
        
        const returnValues = await usdcOracle.getPrice(WBTC.address, USDC.address);
        const price = returnValues[0];
        const timestamp = returnValues[1];
        
        expect(price)
            .to.be.equal(FALLBACK2_BTC_PRICE);
        expect(timestamp)
            .to.be.equal(FALLBACK2_ORACLE_OBSERVATION);
    });
    it("getPrice(WBTC, USDC) should throw ERR_STALE_ORACLE when all oracles are stale", async () => {
        const usdcOracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);
        const MAIN_BTC_PRICE = 42069000000;
        const MAIN_ORACLE_OBSERVATION = (await now() - 60*60*24*2);
        await mainOracle.mock.getPrice.returns(MAIN_BTC_PRICE, MAIN_ORACLE_OBSERVATION);
        const FALLBACK_BTC_PRICE = 42042000000;
        const FALLBACK_ORACLE_OBSERVATION = (await now() - 60*60*24*2);
        await fallbackOracle.mock.getPrice.returns(FALLBACK_BTC_PRICE, FALLBACK_ORACLE_OBSERVATION);
        const FALLBACK2_BTC_PRICE = 69042000000;
        const FALLBACK2_ORACLE_OBSERVATION = (await now() - 60*60*24*2);
        await fallbackOracle2.mock.getPrice.returns(FALLBACK2_BTC_PRICE, FALLBACK2_ORACLE_OBSERVATION);
        await usdcOracle.connect(admin).setPaused(mainOracle.address, true);
        await usdcOracle.connect(admin).setFallbackOracles([fallbackOracle.address,fallbackOracle2.address]);
        
        await expect(usdcOracle.getPrice(WBTC.address, USDC.address))
            .to.be.revertedWith("ERR_STALE_ORACLE");
    });
    it("Should throw ERR_ZERO_ADDRESS when passing paused zero address as oracle", async () => {
        oracle = await usdcOracle_CF.deploy(mainOracle.address, USDC.address);
        await expect(oracle.setPaused(zero_address, true))
            .to.be.revertedWith("ERR_ZERO_ADDRESS");
    });
  });
});
