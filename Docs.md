# DynasetV1 Docs

The Dynaset V1 consists of mainly 5 contracts:

1. DynasetFactory
2. ForgeV1
3. DirectForge
4. Dynaset
5. DynasetTvlOracle

It also depends on other third-party contracts already deployed on the Network such as
OneInchAgregator, UniswapV2Router, UniswapV2Library.

This documentation contains the functional and technical specifications of all of the above contracts.

### Dynaset

Dynaset is a Token that fallows EIP20 token standard, with ability to mint or burn tokens.
Dynaset contract will also hold other ERC20 tokens [Underlying tokens]. Which can be swapped between one another by EOAs that have access of DAM[Dynamic Asset Manager].
Dynaset can accept underlying tokens from ForgeContracts and provide equivalent LPs in return, those LPs will be minted and transferred to Forge Contracts.
Dynaset can collect and burn LP tokens and return an equivalent amount of underlying tokens

### DynasetFactory

DynasetFactory is for deploying dynaset and managing the fee like management and performance fees for respective Dynasets. These fees can be set while creating/initializing the dynasets. The Dynaset and DynasetFactory contracts are used to create the dynaset along with the DynasetForge.
DynasetFactry can transfer the collected fee to a Multisig wallet that is set when deploying the factory contract.

### ForgeV1

ForgeV1 contract will accept deposits from contributors. ForgeV1 can create Forge Objects which will have a contribution token and an array of Depositors.
Each forge object can transfer funds to the dynaset and get back Dynaset-LPs which can then be distributed to contributors.
Users can withdraw dynasets from ForgeV1 once the forge is complete.

### DirectForge

Direct Forge contract will be used alongside ForgeV1 for Low gas fee blockchains, DirectForge mint’s the dynasets at the time of contribution and transfers to contributors wallet.
DirectForge also enables to redeem dynasets. which will take dynasets from user wallets and transfer underlying assets

### DynasetTvlOracle

DynasetTvlOracle enables contracts to get current market values for underlying tokens.
DynasetTvlOracle also gets Total Value locked in USDC equivalent tokens.
Every Contract instance will be associated with a single dynaset. and the contract can return the correct USDC equivalent value of the dynaset token.

#### OneInchAggregator

- OneInchAggregator interface for token swaps.

#### IDynasetTvlOracle

- Interface for contract DynasetTvlOracle.

#### IDynaset

- Interface for Dynaset.sol contract.

#### FixedPoint

- A library for handling binary fixed point numbers (https://en.wikipedia.org/wiki/Q_(number_format))

#### UniswapV2Library

- Uniswap Library that supports DynasetTvlOracle. the library is used from UniswapV2Library.sol

#### UniswapV2OracleLibrary

- Uniswap Library for used in DynasetTvlOracle UniswapV2OracleLibrary

#### PriceLibrary

- Computes observations for Oracle. Computes the average price of a token in terms of weth and the average price

#### DToken

- Standard ERC20 Implementation for the Dynaset. extends IERC20. Dynaset contract implementation

#### ERC20 Interface

- Technical: Standard IERC20 interface to provide the standard functions like - Approve, Transfer, TransferFrom

#### BConst

- Internal Constants used in the Dynaset and Forge.

#### BNum

- Contract used for bmul and bdiv the contract is mainly used in Dynaset contract.

#### IDynasetContract

- Interface for dynaset contract, Forge contract use IDynasetContract for interactions.

#### IUniswapV2Router

- Interface for UniswapV2Router.
