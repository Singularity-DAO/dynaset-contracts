const { expect } = require("chai");
const { waffle, ethers } = require('hardhat');
const { deployMockContract, provider } = waffle;

const ERC20 = require('../artifacts/contracts/interfaces/IERC20.sol/IERC20.json');
const zero_address  = "0x0000000000000000000000000000000000000000";
const gnosisSafe    = "0x0000000000000000000000000000000000000001";
const newGnosisSafe = "0x0000000000000000000000000000000000000002";

var owner, nonOwner;
var dynasetFactory_CF;

describe("DynasetFactory contract", function () {
  beforeEach(async () => {
      [owner, nonOwner, _] = await ethers.getSigners();
      dynasetFactory_CF = await ethers.getContractFactory("DynasetFactory");
  });

  describe("Deployment of DynasetFactory", () => {
    it("Should set gnosisSafe", async () => {
        const dynasetFactory = await dynasetFactory_CF.deploy(gnosisSafe);

        expect(await dynasetFactory.gnosisSafe())
            .to.equal(gnosisSafe);
    });
    it("Should not be able to initialize zero address for gnosisSafe", async () => {
        expect(dynasetFactory_CF.deploy(zero_address))
            .to.be.revertedWith("ERR_ZERO_ADDRESS");
    });
    it("Should not be able to update zero address for gnosisSafe", async () => {
        const newDynasetFactory = await dynasetFactory_CF.deploy(gnosisSafe);
        expect(await newDynasetFactory.gnosisSafe())
            .to.equal(gnosisSafe);
        
        expect(newDynasetFactory.updateGnosisSafe(zero_address))
            .to.be.revertedWith("ERR_ZERO_ADDRESS");
    });
    it("Owner should be able to update gnosisSafe", async () => {
        const dynasetFactory = await dynasetFactory_CF.deploy(gnosisSafe);
        expect(await dynasetFactory.gnosisSafe())
            .to.equal(gnosisSafe);

        await dynasetFactory.updateGnosisSafe(newGnosisSafe);

        expect(await dynasetFactory.gnosisSafe())
            .to.equal(newGnosisSafe);
    });
    it("Non owner should not be able to update gnosisSafe", async () => {
        const dynasetFactory = await dynasetFactory_CF.deploy(gnosisSafe);

        expect(dynasetFactory.updateGnosisSafe(newGnosisSafe))
            .to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
