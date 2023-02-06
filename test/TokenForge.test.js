const truffleAssert = require("truffle-assertions");
const web3 = require("web3");
const oneinch = require("../OneInchApi/oneinchApi");

const ForgeFactory = artifacts.require("ForgeV1");
const TToken = artifacts.require("TToken");
//const BFactory = artifacts.require('BFactory');
const verbose = process.env.VERBOSE;
const { time } = require("@openzeppelin/test-helpers");
const ERC20ABI = require("../build/contracts/TToken.json").abi;

const Bdynaset = artifacts.require("Dynaset");
const DirectForge = artifacts.require("DirectForge");
const USDCOracle = artifacts.require("UsdcOracle");
const Uniswapv3Oracle = artifacts.require("Uniswapv3Oracle");
const ChainlinkOracle = artifacts.require("ChainlinkOracle");
const DynasetTvlOracle = artifacts.require("DynasetTvlOracle");
const Uniswapv2Oracle = artifacts.require("Uniswapv2Oracle");

contract("DynasetForgev1", async (accounts) => {
  const admin = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  const user3 = accounts[3];
  const user4 = accounts[4];
  const user5 = accounts[5];
  const user6 = accounts[6];

  const { toWei } = web3.utils;
  const { fromWei } = web3.utils;
  const errorDelta = 10 ** -8;
  const MAX = web3.utils.toTwosComplement(-1);

  const wethmainet = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const daimainet = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const usdcmainet = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const wBtcmainNet = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599";
  // const agixmainNet = "0x5b7533812759b45c2b44c19e320ba2cd2681b542";
  // const sdaomainnet = "0x993864e43caa7f7f12953ad6feb1d1ca635b875f";
  const ntxmainnet = "0xF0d33BeDa4d734C72684b5f9abBEbf715D0a7935";
  const ustdmainnet = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

  let WETH;
  let USDC;
  let DAI;
  let AGIX;
  let NTX;
  let SDAO;
  let XXX; // addresses
  let weth;
  let usdc;
  let dai;
  let agix;
  let ntx;
  let sdao;
  let xsdao; // TTokens
  let forge; // first forge w/ defaults
  let forgecoins; // first forge w/ defaults
  let dynaset;
  let FORGE; //   forge address
  let FORGECOINS; //   forge address
  let DYN;

  before(async () => {
    const Web3 = new web3("http://127.0.0.1:8545");

    weth = await new Web3.eth.Contract(ERC20ABI, wethmainet);
    usdc = await new Web3.eth.Contract(ERC20ABI, usdcmainet);
    dai = await new Web3.eth.Contract(ERC20ABI, daimainet);
    ntx = await new Web3.eth.Contract(ERC20ABI, ntxmainnet);
    usdt = await new Web3.eth.Contract(ERC20ABI, ustdmainnet);


  let chainLinkOracle;
  let usdcOracle;
  let uniswapv3Oracle;
  let uniswapv2Oracle;


    wethWhale = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    usdcWhale = "0x78605Df79524164911C144801f41e9811B7DB73D";
    daiWhale = "0x7A8EDc710dDEAdDDB0B539DE83F3a306A621E823";
    ntxWhale = "0xa6958bE926d13b18eE886c5b531021fD32d4B9c4";
    sdaoWhale = "0xe92Bd58a5C0d84D4aF48D8B7d28068bcB7a92f74";
    agixWhale = "0x82019e5dC34572eF5E437a2EC06FFF31e6f8ad3C";
    usdtWhale = "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503";

    await usdt.methods.transfer(admin, web3.utils.toWei("100", "Mwei")).send({
      from: usdtWhale,
    });

    await ntx.methods.transfer(admin, web3.utils.toWei("15", "Mwei")).send({
      from: ntxWhale,
    });
    await weth.methods.transfer(admin, web3.utils.toWei("100")).send({
      from: wethWhale, // DAM address
    });
    await usdc.methods
      .transfer(admin, web3.utils.toWei("50000", "Mwei"))
      .send({ from: usdcWhale });
    await dai.methods
      .transfer(admin, web3.utils.toWei("5000"))
      .send({ from: daiWhale });
    console.log(
      "weth balance for admin",
      await weth.methods.balanceOf(admin).call()
    );
    console.log(
      "usdc balance for admin",
      toWei(await usdc.methods.balanceOf(admin).call(), "Mwei")
    );
    console.log(
      "dai balance for admin",
      toWei(await dai.methods.balanceOf(admin).call())
    );
    console.log(
      "ntx balance for admin",
      toWei(await usdc.methods.balanceOf(admin).call(), "Mwei")
    );

    dynaset = await Bdynaset.new(
      admin,
      admin,
      admin,
      "Dynaset weth/usd",
      "DYNWU"

    );

        const uniswapv2Factory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
    const uniswapv3Factory = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
    const chainlink_feedRegistry = "0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf";

    chainLinkOracle = await ChainlinkOracle.new(chainlink_feedRegistry,usdcmainet,wethmainet,wBtcmainNet);
    uniswapv3Oracle = await Uniswapv3Oracle.new(uniswapv3Factory, 240, usdcmainet, wethmainet);
    uniswapv2Oracle = await Uniswapv2Oracle.new(uniswapv2Factory, 240, usdcmainet, wethmainet);
    
    usdcOracle = await USDCOracle.new(chainLinkOracle.address, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48")
    await usdcOracle.setFallbackOracles([uniswapv3Oracle.address,uniswapv2Oracle.address]);
    dynasetTvlOracle = await DynasetTvlOracle.new(dynaset.address,usdcmainet, usdcOracle.address);
    directForge = await DirectForge.new(
      admin,
      dynaset.address,
      dynasetTvlOracle.address
    );
   

    DYN = dynaset.address;
    directForge = await DirectForge.new(
      admin,
      dynaset.address,
      dynasetTvlOracle.address
    );
    forgecoins = await ForgeFactory.new(
      admin,
      dynaset.address,
      dynasetTvlOracle.address
    );

    console.log("forgecoins", forgecoins.address);
    console.log("dynaset", dynaset.address);
  });

  describe("env is setup", () => {
    it("should have the correct balances", async () => {
      assert.isTrue((await weth.methods.balanceOf(admin).call()) >= 10);
      assert.isTrue((await usdc.methods.balanceOf(admin).call()) >= 5000);
      assert.isTrue((await dai.methods.balanceOf(admin).call()) >= 5000);
    });
  });
  // setup uniswap to have full test cases

  // there tests will be moved to seperate file. but we need the chnges in contracts
  // for other tests in the file so we have not removed it entirly.
  describe("Setup Dynaset", () => {
    it("is deployed Correctly", async () => {
      const name = await dynaset.name();
      assert.equal("Dynaset weth/usd", name);
    });

    it("Admin approves tokens", async () => {
      await weth.methods.approve(DYN, MAX).send({ from: admin });
      await usdc.methods.approve(DYN, MAX).send({ from: admin });
      await dai.methods.approve(DYN, MAX).send({ from: admin });
      await ntx.methods.approve(DYN, MAX).send({ from: admin });
    });

    it("initialise Dynaset", async () => {
      await dynaset.initialize(
        [wethmainet, daimainet, ntxmainnet, usdcmainet],
        [toWei("2"), toWei("4121"), toWei("10", "Mwei"), toWei("4121", "Mwei")],
        // [toWei("25"), toWei("5"), toWei("5"), toWei("5")],
        admin
      );

      await truffleAssert.passes(
        dynaset.setMintForge(forgecoins.address, { from: admin })
      );

      await truffleAssert.passes(
        dynaset.setMintForge(directForge.address, { from: admin })
      );

      const numTokens = await dynaset.getNumTokens();

      const totalSupply = await dynaset.totalSupply();
      console.log("totalSupply", totalSupply.toString());

      assert.equal(4, numTokens);
    });

    it("can update oracle prices for all tokens", async () => {
   await truffleAssert.passes(dynasetTvlOracle.updateDynasetTokenPrices());
      await time.increase(300);
      await truffleAssert.passes(dynasetTvlOracle.updateDynasetTokenPrices());

    });

    it("gets DynasetTvlUsdc", async () => {
      const dynasetTvlUsdc = await dynasetTvlOracle.dynasetTvlUsdc();
      console.log(`dynaset tvl usdc: ${fromWei(dynasetTvlUsdc, "Mwei")}`);
    });

    it("has correect balance", async () => {
      const balance = await dynaset.balanceOf(admin);
      assert.equal(toWei("100"), balance);
    });

    it("Get underlying tokens for 100 dynaset convert to eth value", async () => {
      const { tokens, amounts } = await dynaset.calcTokensForAmount(
        toWei("100")
      );
      const currentTokens = await dynaset.getCurrentTokens();
      assert.equal(tokens.length, currentTokens.length);
      assert.equal(amounts.length, currentTokens.length);
    });
  });

  describe("BLACK_SMITH functionality", () => {
    it(" user approve tokens", async () => {
      // await weth.approve(POOL, MAX, { from: user1 });
      // await usdc.approve(POOL, MAX, { from: user1 });
      await dai.methods.approve(forgecoins.address, MAX).send({ from: user1 });
      await dai.methods.approve(forgecoins.address, MAX).send({ from: user2 });
      await dai.methods.approve(forgecoins.address, MAX).send({ from: user3 });
      await dai.methods.approve(forgecoins.address, MAX).send({ from: user4 });
      // await xxx.approve(POOL, MAX, { from: user1 });

      await weth.methods.approve(forgecoins.address, MAX).send({ from: user1 });
      await usdc.methods.approve(forgecoins.address, MAX).send({ from: user1 });
      // await dai.approve(forgecoins.address, MAX, { from: user1 });
      // await xxx.approve(POOL, MAX, { from: user2 });
    });
  });

  describe("create forges", () => {
    it("create eth forge", async () => {
      await truffleAssert.passes(
        forgecoins.createForge(
          true,
          wethmainet,
          toWei("0.1"),
          toWei("100"),
          toWei("100000"),
          { from: admin }
        )
      );
    });

    it("create usdc forge", async () => {
      await truffleAssert.passes(
        forgecoins.createForge(
          false,
          usdcmainet,
          toWei("1", "Mwei"),
          toWei("100", "Mwei"),
          toWei("1000000", "Mwei"),
          {
            from: admin,
          }
        )
      );
    });

    it("create dai forge", async () => {
      await truffleAssert.passes(
        forgecoins.createForge(
          false,
          daimainet,
          toWei("1"),
          toWei("100"),
          toWei("1000000"),
          {
            from: admin,
          }
        )
      );
    });
  });

  describe("enable deposits", () => {
    it("blacksmith can enable eth deposit", async () => {
      await truffleAssert.passes(forgecoins.setDeposit(true, 0));
    });
    it("blacksmith can enable usdc deposit", async () => {
      await truffleAssert.passes(forgecoins.setDeposit(true, 1));
    });
    it("blacksmith can enable dai deposit", async () => {
      await truffleAssert.passes(forgecoins.setDeposit(true, 2));
    });
  });

  describe("deposit", () => {
    it("deposits amount to dai forge", async () => {
      // users would need dai before they can deposit.
      let forgeId = 2;
      let depositAmount = toWei("10");
      [user1, admin].forEach(async (user) => {
        await dai.methods
          .transfer(user, web3.utils.toWei("50"))
          .send({ from: daiWhale });
      });

      await truffleAssert.passes(
        dai.methods
          .approve(forgecoins.address, toWei("10.1"))
          .send({ from: admin })
      );

      let balance = await dai.methods.balanceOf(admin).call();
      console.log(`dai balance of admin :${fromWei(balance)}`);

      let balanceOfUser = await dai.methods.balanceOf(user1).call();
      console.log(`dai balance of user1 :${fromWei(balanceOfUser)}`);

      await truffleAssert.passes(
        forgecoins.deposit(forgeId, depositAmount, admin, {
          from: admin,
        })
      );

      await truffleAssert.passes(
        forgecoins.deposit(forgeId, depositAmount, user1, {
          from: user1,
        })
      );

      let dynasetTVLBefore = await dynasetTvlOracle.dynasetUsdcValuePerShare();
      console.log(
        "dynaset tvl per share",
        fromWei(dynasetTVLBefore.toString())
      );
    });

    it("deposits amount to usdc forge", async () => {
      // users would need usdc before they can deposit.
      let forgeId = 1;
      let depositAmount = toWei("100", "Mwei");
      [user1, user2, user3].forEach(async (user) => {
        await usdc.methods
          .transfer(user, web3.utils.toWei("500", "Mwei"))
          .send({ from: usdcWhale });
      });
      await truffleAssert.passes(
        usdc.methods
          .approve(forgecoins.address, toWei("100.1", "Mwei"))
          .send({ from: admin })
      );

      await truffleAssert.passes(
        forgecoins.deposit(forgeId, depositAmount, admin, {
          from: admin,
        })
      );

      await truffleAssert.passes(
        forgecoins.deposit(forgeId, depositAmount, user1, {
          from: user1,
        })
      );
      //   await truffleAssert.passes(
      //     usdc.methods
      //       .approve(forgecoins.address, toWei("100.1", "Mwei"))
      //       .send({ from: user2 })
      //   );

      //   await truffleAssert.passes(
      //     forgecoins.deposit(1, depositAmount, user2, {
      //       from: user2,
      //     })
      //   );

      let dynasetTVLBefore = await dynasetTvlOracle.dynasetUsdcValuePerShare();
      console.log(
        "dynaset tvl per share",
        fromWei(dynasetTVLBefore.toString())
      );
    });

    // it("can deposit usdc forges after forging eth", async () => {
    //   await truffleAssert.passes(
    //     usdc.methods
    //       .approve(forgecoins.address, toWei("100.1", "Mwei"))
    //       .send({ from: user2 })
    //   );
    //   await truffleAssert.passes(
    //     forgecoins.deposit(1, toWei("10", "Mwei"), user2, {
    //       from: user2,
    //     })
    //   );
    // });

    it("deposits amount to eth  forge", async () => {
      let forgeId = 0;
      let depositAmount = toWei("10");
      await truffleAssert.passes(
        forgecoins.deposit(forgeId, depositAmount, user1, {
          from: user1,
          value: depositAmount,
        })
      );

      await truffleAssert.passes(
        forgecoins.deposit(forgeId, depositAmount, admin, {
          from: admin,
          value: depositAmount,
        })
      );
      let userConftibution = await forgecoins.getUserContribution(
        forgeId,
        user1
      );
      assert.equal(userConftibution, depositAmount);

      const totalContributionUSDC = await forgecoins.calculateContributionUsdc(
        forgeId
      );
      console.log(`totalContributionUSDC: ${totalContributionUSDC}`);
      assert.notEqual(
        totalContributionUSDC.toString(),
        depositAmount.toString()
      );
    });
  });

  //   describe("gets correct details", () => {
  //     it("get eth  contributors", async () => {
  //       const forgeId = 0;
  //       const depositors = await forgecoins.getDepositors(forgeId);
  //       console.log(`forgeId: ${forgeId} has depositors ${depositors}`);
  //       assert.sameMembers(depositors, [admin, user1]);
  //     });

  //     it("get usdc  contributors", async () => {
  //       const forgeId = 1;
  //       const depositors = await forgecoins.getDepositors(forgeId);
  //       console.log(`forgeId: ${forgeId} has depositors ${depositors}`);
  //       assert.sameMembers(depositors, [admin, user1]);
  //     });
  //     it("get dai contributors", async () => {
  //       const forgeId = 2;
  //       const depositors = await forgecoins.getDepositors(forgeId);
  //       console.log(`forgeId: ${forgeId} has depositors ${depositors}`);
  //       assert.sameMembers(depositors, [admin, user1]);
  //     });
  //   });

  //   describe("get output amount", () => {
  //     it("gets correct output amount", async () => {
  //       let forgeId = 0;
  //       let outputAmount = await forgecoins.getOutputAmount(forgeId);
  //       console.log("output amount eth forge", fromWei(outputAmount));
  //       let dynasetusdPrice = await dynasetTvlOracle.dynasetUsdValuePerShare();
  //       console.log("dynaset tvl", dynasetusdPrice.toString());
  //     });

  //     it("gets correct output amount", async () => {
  //       let forgeId = 1;
  //       let outputAmount = await forgecoins.getOutputAmount(forgeId);
  //       console.log("output amount usdc forge", fromWei(outputAmount));
  //       let dynasetusdPrice = await dynasetTvlOracle.dynasetUsdValuePerShare();
  //       console.log("dynaset tvl", dynasetusdPrice.toString());
  //     });
  //   });

  //   describe("get correct token amounts", async () => {
  //     it("gets correct tokens for amount", async () => {
  //       let { tokens, amounts } = await dynaset.calcTokensForAmount(
  //         toWei("1.73913")
  //       );
  //       console.log(JSON.stringify(tokens));
  //       for (let i = 0; i < tokens.length; i++) {
  //         let amount = amounts[i];
  //         let token = tokens[i];
  //         console.log(
  //           `token ${token} needs ${fromWei(
  //             amount,
  //             token == usdcmainet || token == ntxmainnet ? "Mwei" : ""
  //           )} amount`
  //         );
  //       }
  //     });
  //   });

  describe("can forge", () => {
    it("admin can start forging eth forge", async () => {
      await truffleAssert.passes(forgecoins.startForging(0, { from: admin }));
    });

    it("admin can  forge eth forge", async () => {
      await dynaset.setDynasetOracle(dynasetTvlOracle.address);

      let outputAmount = await forgecoins.getOutputAmount(0);
      console.log("output amount for forge", fromWei(outputAmount));

      let totalSupplyBeforeJoin = await dynaset.totalSupply();
      console.log("totalSupply before join", fromWei(totalSupplyBeforeJoin));
      let { tokens, amounts } = await dynaset.calcTokensForAmount(outputAmount);

      for (var i in amounts) {
        console.log("amounts for token", tokens[i], fromWei(amounts[i]));
      }

      const dynasetWethBalanceBefore = await weth.methods
        .balanceOf(dynaset.address)
        .call();

      console.log(
        "dynaset weth balacne before forge",
        fromWei(dynasetWethBalanceBefore)
      );

      let dynasetTVLBefore = await dynasetTvlOracle.dynasetUsdcValuePerShare();
      console.log(
        "dynaset tvl per share",
        fromWei(dynasetTVLBefore.toString())
      );

      await truffleAssert.passes(
        forgecoins.forgeFunction(0, 2, 0, { from: admin })
      );

      const dynasetWethBalanceAfter = await weth.methods
        .balanceOf(dynaset.address)
        .call();
      console.log(
        "dynaset weth balacne after forge",
        fromWei(dynasetWethBalanceAfter)
      );

      let dynasetTVLAfter = await dynasetTvlOracle.dynasetUsdcValuePerShare();
      console.log(
        "dynaset tvl per share",
        fromWei(dynasetTVLBefore.toString())
      );
      let totalSupplyAfterJoin = await dynaset.totalSupply();
      console.log("totalSupply after join", fromWei(totalSupplyAfterJoin));
    });

    it("can deposit usdc forges after forging eth", async () => {
      await truffleAssert.passes(
        usdc.methods
          .approve(forgecoins.address, toWei("100.1", "Mwei"))
          .send({ from: user2 })
      );
      await truffleAssert.passes(
        forgecoins.deposit(1, toWei("10", "Mwei"), user2, {
          from: user2,
        })
      );

      let dynasetTVLBefore = await dynasetTvlOracle.dynasetUsdcValuePerShare();
      console.log(
        "dynaset tvl per share",
        fromWei(dynasetTVLBefore.toString())
      );
    });

    it("admin can start forging usdc forge", async () => {
      await truffleAssert.passes(forgecoins.startForging(1, { from: admin }));
    });

    it("admin can  forge usdc forge", async () => {
      let forgeBalance = await forgecoins.getForgeBalance(1);
      console.log("forgebalance", fromWei(forgeBalance, "Mwei"));
      await dynaset.setDynasetOracle(dynasetTvlOracle.address);

      let dynasetTVLBefore = await dynasetTvlOracle.dynasetUsdcValuePerShare();
      console.log(
        "dynaset tvl per share",
        fromWei(dynasetTVLBefore.toString())
      );
      let totalSupplyBeforeJoin = await dynaset.totalSupply();
      console.log("totalSupply before join", fromWei(totalSupplyBeforeJoin));
      let outputAmount = await forgecoins.getOutputAmount(1);
      console.log("output amount for forge", fromWei(outputAmount));

      await truffleAssert.passes(
        forgecoins.forgeFunction(1, 2, 0, { from: admin }),
        "ERR_MATH_APPROX"
      );

      await truffleAssert.passes(
        forgecoins.forgeFunction(1, 2, 0, { from: admin })
      );
      let dynasetTVLAfter = await dynasetTvlOracle.dynasetUsdcValuePerShare();
      console.log(
        "dynaset tvl per share",
        fromWei(dynasetTVLBefore.toString())
      );
      let totalSupplyAfterJoin = await dynaset.totalSupply();
      console.log("totalSupply after join", fromWei(totalSupplyAfterJoin));
    });

    it("admin can start forging dai forge", async () => {
      await truffleAssert.passes(forgecoins.startForging(2, { from: admin }));
    });

    it("admin can  forge dai forge", async () => {
      await dynaset.setDynasetOracle(dynasetTvlOracle.address);
      await truffleAssert.passes(
        forgecoins.forgeFunction(2, 2, 0, { from: admin })
      );

      let dynasetTVLBefore = await dynasetTvlOracle.dynasetUsdcValuePerShare();
      console.log(
        "dynaset tvl per share",
        fromWei(dynasetTVLBefore.toString())
      );
    });
  });
});
