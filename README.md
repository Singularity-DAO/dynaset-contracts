# Dynasets

## Contracts

Solidity smart contracts are found in `./contracts/`.

## Requirements

- [Node.js](https://github.com/nodejs/node) (v10.11.0)
- [Npm](https://www.npmjs.com/package/npm) (6.4.1)
- [Truffle](https://www.npmjs.com/package/truffle) (v5.5.7)

# Project Structure

This a truffle javascript project.

## Tests

Truffle tests are found in the `./test/` folder.
Hardhat unit tests are found in the `./unit-test/` folder.
Hardhat integration tests are found in the `./integration-test/` folder.

### Install test dependencies

- install all the node modules

```sh
npm install --save
```

### To run truffle test cases

- Start ganache cli using command

```
ganache -f https://mainnet.infura.io/v3/<API-KEY> -u 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2 0x78605Df79524164911C144801f41e9811B7DB73D 0x7A8EDc710dDEAdDDB0B539DE83F3a306A621E823 0xa6958bE926d13b18eE886c5b531021fD32d4B9c4 0xe92Bd58a5C0d84D4aF48D8B7d28068bcB7a92f74 0x82019e5dC34572eF5E437a2EC06FFF31e6f8ad3C 0x5754284f345afc66a98fbb0a0afe71e0f007b949 0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503

```

- create .env file in the root directory and add PRIVATE_KEY variable that will be used to deploy contracts in truffle migrations
- install ganache cli on your local.
- Get [API key to connect with Ethereum node](https://infura.io/) which will be required to start the ganache

- start the mainnet fork of the etheremum blockchain using ganache-cli. replace the API key with <-infura-api-key->

- test all contracts

```sh
npm run test
```

- to test dynaset

```sh
npm run test:dynaset
```

- to test DynasetFactory

```sh
npm run test:factory
```

- to test ForgeV1

```sh
npm run test:forgeV1
```

- to test DirectForge

```sh
npm run test:directforge
```

### To run hardhat unit-tests

```sh
npm run unit-test
```

### To run hardhat unit-tests with coverage

```sh
npm run unit-test-coverage
```

### To run hardhat integration-tests

```sh
npm run integration-test
```

### To run hardhat integration-tests with coverage

```sh
npm run integration-test-coverage
```

## Deploy

We need to deploy contracts in order fallowing order as the deployed address on one is used in constructor of others.

1. Dynaset.
2. DynasetTvlOracle [Need to provide dynaset address in constructor.]
3. ForgeV1 & DirectForge [Order does not have any effects], [Both contracts need dynaset and dynasetTvlOracle address in constructor]

Deploy script can be found in the `migrations/2_deploy_contracts.js` file.
or just run the command

```sh
npm run deploy
```

## Deployment Scripts

To deploy the contracts to the blockchain, you can configure the RPC endpoint under the `getInfuraProvider` function at `./scripts/ethers-provider.ts`.

A private key for the deployment must also be provided as an environment variable called `ACCOUNT_PRIVATE_KEY`.

Then, you can run these commands to setup the contracts & testing environment:

```sh
npm run compile
npm run setup-aws-ganache
```

And to mint the LP tokens you can run:

```sh
npm run forge-aws
```
