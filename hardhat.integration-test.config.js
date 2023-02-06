require("dotenv").config();

require("@nomicfoundation/hardhat-toolbox");
//require("@nomicfoundation/hardhat-chai-matchers");
require("@nomiclabs/hardhat-waffle");
require('hardhat/types');
require("@nomiclabs/hardhat-etherscan");
require('hardhat-deploy');
require("@nomiclabs/hardhat-truffle5");
//require('hardhat-deploy-ethers');

//require("hardhat-gas-reporter");
//require('hardhat-contract-sizer');     // run: npx hardhat size-contracts
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

module.exports = {
    defaultNetwork: "hardhat",
    namedAccounts: {
       deployer: 0,
    },
    networks: {
        hardhat: {
           chainId: 31337,
           forking: {
              // eslint-disable-next-line
              enabled: true,
              url: "https://rpc.ankr.com/eth" // can always find alternative rpc nodes https://ethereumnodes.com/
           },
           timeout: 600000,
           test_accounts,
           // needed for instrumentation to be able to run coverage
           allowUnlimitedContractSize: true, 
           gas: 900000000,
           blockGasLimit: 0x1fffffffffffff
        },
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
   paths: {
      sources: "./contracts",
      tests: "./integration-test",
      cache: "./cache",
      artifacts: "./artifacts"
   },
   mocha: {
      timeout: 100000000
   },
   tracer: {
      nameTags: {
        '0x0000000000000000000000000000000000000000': 'zero-address',
      },
   }
};

