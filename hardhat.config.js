require("dotenv").config();

//require("@nomicfoundation/hardhat-chai-matchers");
require('@nomiclabs/hardhat-waffle');
require('hardhat/types');
require("@nomiclabs/hardhat-etherscan");
require('hardhat-deploy');
require("@nomiclabs/hardhat-truffle5");
//require('hardhat-deploy-ethers');

//require("hardhat-gas-reporter");
require('hardhat-contract-sizer');     // run: npx hardhat size-contracts
require("@nomiclabs/hardhat-solhint"); // run: npx hardhat check
require('solidity-coverage');          // run: npx harhdat coverage
require("hardhat-tracer");             // run: npx hardhat test --logs
require('hardhat-log-remover');        // run: npx hardhat remove-logs

let mnemonic = process.env.MNEMONIC;
if (!mnemonic) {
  // FOR DEV ONLY, SET IT IN .env files if you want to keep it private
  // (IT IS IMPORTANT TO HAVE A NON RANDOM MNEMONIC SO THAT SCRIPTS CAN ACT ON THE SAME ACCOUNTS)
  mnemonic = 'test test test test test test test test test test test junk';
}
const test_accounts = {
  mnemonic,
  count: 10
};

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const DEFAULT_PRIVATE_KEY = "f4203c97278435ed4a2bea4c0ae6f1bdaa27c3a66654dee8e27d30dd6ff01e55";
const PRIVATE_KEY = process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY : DEFAULT_PRIVATE_KEY;

module.exports = {
    defaultNetwork: "hardhat",
    namedAccounts: {
       deployer: 0,
    },
    networks: {
        fork : {
          url: 'http://127.0.0.1:8545/',
          chainId: 31337,
          timeout: 120000,
          accounts: [PRIVATE_KEY]
        },
        localhost : {
          url: 'http://127.0.0.1:7545/',
          accounts: [PRIVATE_KEY]
        },
        hardhat: {
           chainId: 31337,
           forking: {
              // eslint-disable-next-line
              enabled: true,
//              url: "https://cloudflare-eth.com"
              url: "https://rpc.ankr.com/eth"
           },
           timeout: 600000,
           test_accounts
        },
        mainnet: {
          chainId: 1,
          accounts: [PRIVATE_KEY],
          url: "https://cloudflare-eth.com" // can always find alternative rpc nodes https://ethereumnodes.com/
        },
        bsc: {
          chainId: 56,
          accounts: [PRIVATE_KEY],
          url: "https://bsc-dataseed.binance.org/"
        },
        andromeda: {
          chainId: 1088,
          accounts: [PRIVATE_KEY],
          url: "https://andromeda.metis.io/?owner=1088"
        },
        polygon: {
          chainId: 137,
          accounts: [PRIVATE_KEY],
//          url: "https://rpc-mainnet.matic.quiknode.pro"
//          url: "https://rpc-mainnet.matic.network"
//          url: "https://rpc-mainnet.maticvigil.com"
          url: "https://matic-mainnet.chainstacklabs.com"
        },
        opera: {
          chainId: 250,
          accounts: [PRIVATE_KEY],
          timeout: 600000,
//          url: "https://rpcapi.fantom.network/"
          url: "https://rpc.ankr.com/fantom"
//          url: "https://rpc.fantom.network/"
//          url: "https://rpc3.fantom.network/"
//          url: "https://rpc.ftm.tools/"
//          url: "https://ftmrpc.ultimatenodes.io/"
        }
  },
  solidity: {
     version: "0.8.15",
     settings: {
        optimizer: {
           enabled: true,
           runs: 200
        }
     }
   },
   etherscan: {
      apiKey: {
        mainnet: "...",
        bsc: "...",
        opera: "...",
        polygon: "...",
      }
   },
   paths: {
      sources: "./contracts",
      tests: "./unit-test",
      cache: "./cache",
      artifacts: "./artifacts"
   },
   gasReporter: {
      currency: "USD",
      coinmarketcap: "b0c64afd-6aca-4201-8779-db8dc03e9793"
   },
   contractSizer: {
     alphaSort: false,
     disambiguatePaths: false,
     runOnCompile: true,
     strict: true,
   }
};
