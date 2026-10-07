[**Documentation v2**](../../../README.md)

***

[Documentation](../../../README.md) / [@solana-agent-kit/plugin-defi](../README.md) / default

# Variable: default

> `const` **default**: `object`

Defined in: [packages/plugin-defi/src/index.ts:195](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/plugin-defi/src/index.ts#L195)

## Type declaration

### actions

> **actions**: `Action$1`[]

### initialize()

> **initialize**: (`agent`) => `void`

#### Parameters

##### agent

`SolanaAgentKit`

#### Returns

`void`

### methods

> **methods**: `object`

#### methods.calculatePerpMarketFundingRate()

> **methods.calculatePerpMarketFundingRate**: (`agent`, `marketSymbol`, `period`) => `Promise`\<\{ `friendlyString`: `string`; `longRate`: `number`; `shortRate`: `number`; \}\>

Calculate the funding rate for a perpetual market

##### Parameters

###### agent

`SolanaAgentKit`

###### marketSymbol

`` `${string}-PERP` ``

###### period

`"year"` | `"hour"`

##### Returns

`Promise`\<\{ `friendlyString`: `string`; `longRate`: `number`; `shortRate`: `number`; \}\>

#### methods.cancelAllOrders()

> **methods.cancelAllOrders**: (`agent`, `marketId`) => `Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Cancels all orders from Manifest

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### marketId

`PublicKey`

Public key for the manifest market

##### Returns

`Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Transaction signature

#### methods.checkDebridgeTransactionStatus()

> **methods.checkDebridgeTransactionStatus**: (`txHash`) => `Promise`\<`deBridgeOrderStatusResponse`[]\>

Check the status of a bridge transaction using its transaction hash

##### Parameters

###### txHash

`string`

Transaction hash to check status for

##### Returns

`Promise`\<`deBridgeOrderStatusResponse`[]\>

Status information for the bridge transaction

##### Throws

If the API request fails or returns an error

#### methods.closePerpTradeLong()

> **methods.closePerpTradeLong**: (`__namedParameters`) => `Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Close long trade on Adrena

##### Parameters

###### \_\_namedParameters

###### agent

`SolanaAgentKit`

###### price

`number`

###### tradeMint

`PublicKey`

##### Returns

`Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Transaction signature

#### methods.closePerpTradeShort()

> **methods.closePerpTradeShort**: (`__namedParameters`) => `Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Close short trade on Adrena

##### Parameters

###### \_\_namedParameters

###### agent

`SolanaAgentKit`

###### price

`number`

###### tradeMint

`PublicKey`

##### Returns

`Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Transaction signature

#### methods.createDebridgeBridgeOrder()

> **methods.createDebridgeBridgeOrder**: (`params`) => `Promise`\<`deBridgeOrderResponse`\>

Create a bridge order for cross-chain token transfer

##### Parameters

###### params

`deBridgeOrderInput`

Bridge order parameters

##### Returns

`Promise`\<`deBridgeOrderResponse`\>

Bridge order details and transaction data

#### methods.createDriftUserAccount()

> **methods.createDriftUserAccount**: (`agent`, `amount`, `symbol`) => `Promise`\<\{ `account`: `PublicKey`; `message`: `undefined`; `txSignature`: `string`; \} \| \{ `account`: `PublicKey`; `message`: `string`; `txSignature`: `undefined`; \}\>

Create a drift user account provided an amount

##### Parameters

###### agent

`SolanaAgentKit`

###### amount

`number`

amount of the token to deposit

###### symbol

`string`

symbol of the token to deposit

##### Returns

`Promise`\<\{ `account`: `PublicKey`; `message`: `undefined`; `txSignature`: `string`; \} \| \{ `account`: `PublicKey`; `message`: `string`; `txSignature`: `undefined`; \}\>

#### methods.createDriftVault()

> **methods.createDriftVault**: (`agent`, `params`) => `Promise`\<`string`\> = `createVault`

Create a vault

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### params

Vault creation parameters

###### hurdleRate?

`number`

Hurdle rate percentage

###### managementFee

`number`

Management fee percentage (e.g 2 == 2%)

###### marketName

`` `${string}-${string}` ``

Market name of the vault (e.g. "USDC-SPOT")

###### maxTokens

`number`

Maximum amount that can be deposited into the vault (in tokens)

###### minDepositAmount

`number`

Minimum amount that can be deposited into the vault (in tokens)

###### name

`string`

Name of the vault (must be unique)

###### permissioned?

`boolean`

Whether the vault uses a whitelist

###### profitShare

`number`

Profit share percentage (e.g 20 == 20%)

###### redeemPeriod

`number`

Redeem period in seconds

##### Returns

`Promise`\<`string`\>

Promise&lt;anchor.Web3.TransactionSignature&gt; - The transaction signature of the vault creation

#### methods.createMeteoraDlmmPool()

> **methods.createMeteoraDlmmPool**: (`agent`, `binStep`, `tokenAMint`, `tokenBMint`, `initialPrice`, `priceRoundingUp`, `feeBps`, `activationType`, `hasAlphaVault`, `activationPoint`) => `Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Create Meteora DLMM pool

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### binStep

`number`

DLMM pool bin step

###### tokenAMint

`PublicKey`

Token A mint

###### tokenBMint

`PublicKey`

Token B mint

###### initialPrice

`number`

Initial pool price in ratio tokenA / tokenB

###### priceRoundingUp

`boolean`

Whether to rounding up the initial pool price

###### feeBps

`number`

Pool trading fee in BPS

###### activationType

`ActivationType`

Pool activation type (ActivationType.Timestamp or ActivationType.Slot)

###### hasAlphaVault

`boolean`

Whether the pool has Meteora alpha vault or not

###### activationPoint

Activation point depending on activation type, or null if pool doesn't have an activation point

`undefined` | `BN`

##### Returns

`Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Transaction signature

#### methods.createMeteoraDynamicAMMPool()

> **methods.createMeteoraDynamicAMMPool**: (`agent`, `tokenAMint`, `tokenBMint`, `tokenAAmount`, `tokenBAmount`, `customizableParams`) => `Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Create Meteora Dynamic AMM pool

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### tokenAMint

`PublicKey`

Token A mint

###### tokenBMint

`PublicKey`

Token B mint

###### tokenAAmount

`BN`

Token A amount in lamport units

###### tokenBAmount

`BN`

Token B amount in lamport units

###### customizableParams

`DecodeStruct`

Parameters to create Dynamic AMM pool
       tradeFeeNumerator (number): Trade fee numerator, with default denominator is 100000
       activationType (enum): Should be ActivationType.Timestamp or ActivationType.Slot
       activationPoint (BN | null): Activation point depending on activation type, or null if pool doesn't have an activation point
       hasAlphaVault (boolean): Whether the pool has Meteora alpha vault or not
       padding (Array&lt;number&gt;): Should be set to value Array(90).fill(0)

##### Returns

`Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Transaction signature

#### methods.depositIntoDriftVault()

> **methods.depositIntoDriftVault**: (`agent`, `amount`, `vault`) => `Promise`\<`string`\> = `depositIntoVault`

Deposit tokens into a vault

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### amount

`number`

Amount to deposit into the vault (in tokens)

###### vault

`string`

Vault address

##### Returns

`Promise`\<`string`\>

Promise&lt;anchor.Web3.TransactionSignature&gt; - The transaction signature of the deposit

#### methods.depositToDriftUserAccount()

> **methods.depositToDriftUserAccount**: (`agent`, `amount`, `symbol`, `isRepay`) => `Promise`\<`TxSigAndSlot`\>

Deposit to your drift user account

##### Parameters

###### agent

`SolanaAgentKit`

###### amount

`number`

###### symbol

`string`

###### isRepay

`boolean` = `false`

##### Returns

`Promise`\<`TxSigAndSlot`\>

#### methods.deriveDriftVaultAddress()

> **methods.deriveDriftVaultAddress**: (`agent`, `name`) => `Promise`\<`PublicKey`\>

##### Parameters

###### agent

`SolanaAgentKit`

###### name

`string`

##### Returns

`Promise`\<`PublicKey`\>

#### methods.doesUserHaveDriftAccount()

> **methods.doesUserHaveDriftAccount**: (`agent`) => `Promise`\<\{ `account`: `PublicKey`; `hasAccount`: `boolean`; \}\>

Check if a user has a drift account

##### Parameters

###### agent

`SolanaAgentKit`

##### Returns

`Promise`\<\{ `account`: `PublicKey`; `hasAccount`: `boolean`; \}\>

#### methods.driftPerpTrade()

> **methods.driftPerpTrade**: (`agent`, `params`) => `Promise`\<`string`\>

Open a perpetual trade on drift

##### Parameters

###### agent

`SolanaAgentKit`

###### params

###### action

`"long"` \| `"short"`

###### amount

`number`

###### price?

`number`

this should only be supplied if type is limit

###### symbol

`string`

###### type

`"market"` \| `"limit"`

##### Returns

`Promise`\<`string`\>

#### methods.driftUserAccountInfo()

> **methods.driftUserAccountInfo**: (`agent`) => `Promise`\<\{ `accountAddress`: `string`; `authority`: `PublicKey`; `lastActiveSlot`: `number`; `name`: `number`[]; `overallBalance`: `number`; `perpPositions`: `object`[]; `settledPerpPnl`: `string`; `spotPositions`: (`undefined` \| \{ `availableBalance`: `number`; `openAsks`: `number`; `openBids`: `number`; `openOrders`: `number`; `symbol`: `string`; `type`: `string`; \})[]; \}\>

Get account info for a drift User

##### Parameters

###### agent

`SolanaAgentKit`

##### Returns

`Promise`\<\{ `accountAddress`: `string`; `authority`: `PublicKey`; `lastActiveSlot`: `number`; `name`: `number`[]; `overallBalance`: `number`; `perpPositions`: `object`[]; `settledPerpPnl`: `string`; `spotPositions`: (`undefined` \| \{ `availableBalance`: `number`; `openAsks`: `number`; `openBids`: `number`; `openOrders`: `number`; `symbol`: `string`; `type`: `string`; \})[]; \}\>

#### methods.executeDebridgeBridgeOrder()

> **methods.executeDebridgeBridgeOrder**: (`agent`, `transactionData`) => `Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Execute a bridge transaction on Solana.

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### transactionData

`string`

Hex-encoded transaction data

##### Returns

`Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Transaction signature

#### methods.flashCloseTrade()

> **methods.flashCloseTrade**: (`agent`, `params`) => `Promise`\<`string`\>

Closes an existing position on Flash.Trade

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### params

`FlashCloseTradeParams`

Trade parameters

##### Returns

`Promise`\<`string`\>

Transaction signature

#### methods.flashOpenTrade()

> **methods.flashOpenTrade**: (`agent`, `params`) => `Promise`\<`string`\>

Opens a new position on Flash.Trade

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### params

`FlashTradeParams`

Trade parameters

##### Returns

`Promise`\<`string`\>

Transaction signature

#### methods.fluxBeamCreatePool()

> **methods.fluxBeamCreatePool**: (`agent`, `token_a`, `token_a_amount`, `token_b`, `token_b_amount`) => `Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Create a new pool using FluxBeam

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### token\_a

`PublicKey`

token mint address of the first token

###### token\_a\_amount

`number`

Amount to swap (in token decimals)

###### token\_b

`PublicKey`

Source token mint address (defaults to USDC)

###### token\_b\_amount

`number`

Source token mint address (defaults to USDC)

##### Returns

`Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Transaction signature

#### methods.getAvailableDriftPerpMarkets()

> **methods.getAvailableDriftPerpMarkets**: () => `PerpMarketConfig`[]

Get available perp markets on drift protocol

##### Returns

`PerpMarketConfig`[]

#### methods.getAvailableDriftSpotMarkets()

> **methods.getAvailableDriftSpotMarkets**: () => `SpotMarketConfig`[]

Get available spot markets on drift protocol

##### Returns

`SpotMarketConfig`[]

#### methods.getBridgeQuote()

> **methods.getBridgeQuote**: (`params`) => `Promise`\<`deBridgeOrderResponse`\>

Get a quote for bridging tokens between chains AND build the transaction.
This endpoint returns both the quote and transaction data needed for execution.

##### Parameters

###### params

`deBridgeOrderInput`

Required parameters for building a bridge transaction

##### Returns

`Promise`\<`deBridgeOrderResponse`\>

Quote information and transaction data

#### methods.getDebridgeSupportedChains()

> **methods.getDebridgeSupportedChains**: () => `Promise`\<`deBridgeSupportedChainsResponse`\>

Get list of chains supported by deBridge protocol

##### Returns

`Promise`\<`deBridgeSupportedChainsResponse`\>

List of supported chains with their configurations

##### Throws

If the API request fails or returns an error

#### methods.getDebridgeTokensInfo()

> **methods.getDebridgeTokensInfo**: (`parameters`) => `Promise`\<`deBridgeTokensInfoResponse`\>

Get token information from a chain. Chain ID must be specified (e.g., '1' for Ethereum, '56' for BSC, '137' for Polygon).
For EVM chains: use 0x-prefixed address. For Solana: use base58 token address.

##### Parameters

###### parameters

###### chainId

`string` = `...`

Chain ID to query tokens for

###### search?

`string` = `...`

Optional search term to filter tokens by name or symbol

###### tokenAddress?

`string` = `...`

Optional token address to filter results

##### Returns

`Promise`\<`deBridgeTokensInfoResponse`\>

Token information including name, symbol, and decimals

##### Throws

If the API request fails or returns an error

##### Example

```typescript
// Get USDC on Ethereum
const ethUSDC = await getDebridgeTokensInfo({
  chainId: "1",
  search: "USDC"
});

// Get USDC on BSC
const bscUSDC = await getDebridgeTokensInfo({
  chainId: "56",
  search: "USDC"
});
```

#### methods.getDriftFundingRateAsPercentage()

> **methods.getDriftFundingRateAsPercentage**: (`rawFundingRate`) => `number` = `getFundingRateAsPercentage`

To get funding rate as a percentage, you need to multiply by the funding rate buffer precision

##### Parameters

###### rawFundingRate

`BN`

##### Returns

`number`

#### methods.getDriftL2OrderBook()

> **methods.getDriftL2OrderBook**: (`marketSymbol`) => `Promise`\<\{ `asks`: `object`[]; `bids`: `object`[]; `oracleData`: \{ `confidence`: `undefined` \| `BN`; `hasSufficientNumberOfDataPoints`: `boolean`; `maxPrice`: `undefined` \| `BN`; `price`: `undefined` \| `BN`; `slot`: `undefined` \| `BN`; `twap`: `undefined` \| `BN`; `twapConfidence`: `undefined` \| `BN`; \}; `slot`: `undefined` \| `number`; \}\> = `getL2OrderBook`

##### Parameters

###### marketSymbol

`` `${string}-PERP` ``

##### Returns

`Promise`\<\{ `asks`: `object`[]; `bids`: `object`[]; `oracleData`: \{ `confidence`: `undefined` \| `BN`; `hasSufficientNumberOfDataPoints`: `boolean`; `maxPrice`: `undefined` \| `BN`; `price`: `undefined` \| `BN`; `slot`: `undefined` \| `BN`; `twap`: `undefined` \| `BN`; `twapConfidence`: `undefined` \| `BN`; \}; `slot`: `undefined` \| `number`; \}\>

#### methods.getDriftMarketIndexAndType()

> **methods.getDriftMarketIndexAndType**: (`name`) => \{ `marketIndex`: `number`; `marketType`: \{ `perp`: \{ \}; \}; \} \| \{ `marketIndex`: `number`; `marketType`: \{ `spot`: \{ \}; \}; \} = `getMarketIndexAndType`

##### Parameters

###### name

`` `${string}-${string}` ``

##### Returns

\{ `marketIndex`: `number`; `marketType`: \{ `perp`: \{ \}; \}; \} \| \{ `marketIndex`: `number`; `marketType`: \{ `spot`: \{ \}; \}; \}

#### methods.getEntryQuoteOfDriftPerpTrade()

> **methods.getEntryQuoteOfDriftPerpTrade**: (`marketSymbol`, `amount`, `type`) => `Promise`\<\{ `bestPrice`: `number`; `entryPrice`: `number`; `priceImpact`: `number`; `worstPrice`: `number`; \}\> = `getEntryQuoteOfPerpTrade`

Get the estimated entry quote of a perp trade

##### Parameters

###### marketSymbol

`` `${string}-PERP` ``

###### amount

`number`

###### type

`"long"` | `"short"`

##### Returns

`Promise`\<\{ `bestPrice`: `number`; `entryPrice`: `number`; `priceImpact`: `number`; `worstPrice`: `number`; \}\>

#### methods.getLendingAndBorrowAPY()

> **methods.getLendingAndBorrowAPY**: (`agent`, `symbol`) => `Promise`\<\{ `borrowAPY`: `number`; `lendingAPY`: `number`; \}\>

Get the APY for lending and borrowing a specific token on drift protocol

##### Parameters

###### agent

`SolanaAgentKit`

###### symbol

`string`

##### Returns

`Promise`\<\{ `borrowAPY`: `number`; `lendingAPY`: `number`; \}\>

#### methods.getVaultAddress()

> **methods.getVaultAddress**: (`agent`, `name`) => `Promise`\<`PublicKey`\>

Get a vaults address using the vault's name

##### Parameters

###### agent

`SolanaAgentKit`

###### name

`string`

##### Returns

`Promise`\<`PublicKey`\>

#### methods.getVaultInfo()

> **methods.getVaultInfo**: (`agent`, `vaultNameOrAddress`) => `Promise`\<\{ `address`: `string`; `balance`: `string`; `delegate`: `string`; `hurdleRate`: `number`; `managementFee`: `number`; `marketName`: `string`; `maxTokens`: `number`; `minDepositAmount`: `number`; `name`: `string`; `permissioned`: `boolean`; `profitShare`: `number`; `redeemPeriod`: `number`; \}\>

Get information on a particular vault given its name

##### Parameters

###### agent

`SolanaAgentKit`

###### vaultNameOrAddress

`string`

##### Returns

`Promise`\<\{ `address`: `string`; `balance`: `string`; `delegate`: `string`; `hurdleRate`: `number`; `managementFee`: `number`; `marketName`: `string`; `maxTokens`: `number`; `minDepositAmount`: `number`; `name`: `string`; `permissioned`: `boolean`; `profitShare`: `number`; `redeemPeriod`: `number`; \}\>

#### methods.lendAsset()

> **methods.lendAsset**: (`agent`, `amount`) => `Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Lend tokens for yields using Lulo

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### amount

`number`

Amount of USDC to lend

##### Returns

`Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Transaction signature

#### methods.limitOrder()

> **methods.limitOrder**: (`agent`, `marketId`, `quantity`, `side`, `price`) => `Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Place limit orders using Manifest

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### marketId

`PublicKey`

Public key for the manifest market

###### quantity

`number`

Amount to trade in tokens

###### side

`string`

Buy or Sell

###### price

`number`

Price in tokens ie. SOL/USDC

##### Returns

`Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Transaction signature

#### methods.luloLend()

> **methods.luloLend**: (`agent`, `mintAddress`, `amount`) => `Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Lend tokens for yields using Lulo

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### mintAddress

`string`

SPL Mint address

###### amount

`number`

Amount to lend

##### Returns

`Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Transaction signature

#### methods.luloWithdraw()

> **methods.luloWithdraw**: (`agent`, `mintAddress`, `amount`) => `Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Withdraw tokens for yields using Lulo

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### mintAddress

`string`

SPL Mint address

###### amount

`number`

Amount to withdraw

##### Returns

`Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Transaction signature

#### methods.manifestCreateMarket()

> **methods.manifestCreateMarket**: (`agent`, `baseMint`, `quoteMint`) => `Promise`\<(`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[])[]\>

##### Parameters

###### agent

`SolanaAgentKit`

###### baseMint

`PublicKey`

###### quoteMint

`PublicKey`

##### Returns

`Promise`\<(`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[])[]\>

#### methods.openbookCreateMarket()

> **methods.openbookCreateMarket**: (`agent`, `baseMint`, `quoteMint`, `lotSize`, `tickSize`) => `Promise`\<(`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[])[]\>

##### Parameters

###### agent

`SolanaAgentKit`

###### baseMint

`PublicKey`

###### quoteMint

`PublicKey`

###### lotSize

`number` = `1`

###### tickSize

`number` = `0.01`

##### Returns

`Promise`\<(`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[])[]\>

#### methods.openPerpTradeLong()

> **methods.openPerpTradeLong**: (`__namedParameters`) => `Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Open long trade on Adrena

Note: provide the same token as collateralMint and as tradeMint to avoid swap

##### Parameters

###### \_\_namedParameters

###### agent

`SolanaAgentKit`

###### collateralAmount

`number`

###### collateralMint?

`PublicKey` = `TOKENS.jitoSOL`

###### leverage?

`number` = `DEFAULT_OPTIONS.LEVERAGE_BPS`

###### price

`number`

###### slippage?

`number` = `0.3`

###### tradeMint?

`PublicKey` = `TOKENS.jitoSOL`

##### Returns

`Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Transaction signature

#### methods.openPerpTradeShort()

> **methods.openPerpTradeShort**: (`__namedParameters`) => `Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Open short trade on Adrena

Note: provide USDC as collateralMint to avoid swap

##### Parameters

###### \_\_namedParameters

###### agent

`SolanaAgentKit`

###### collateralAmount

`number`

###### collateralMint?

`PublicKey` = `TOKENS.USDC`

###### leverage?

`number` = `DEFAULT_OPTIONS.LEVERAGE_BPS`

###### price

`number`

###### slippage?

`number` = `0.3`

###### tradeMint?

`PublicKey` = `TOKENS.jitoSOL`

##### Returns

`Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Transaction signature

#### methods.orcaClosePosition()

> **methods.orcaClosePosition**: (`agent`, `positionMintAddress`) => `Promise`\<`string`\>

# Closes a Liquidity Position in an Orca Whirlpool

This function closes an existing liquidity position in a specified Orca Whirlpool. The user provides
the position's mint address.

## Parameters
- `agent`: The `SolanaAgentKit` instance representing the wallet and connection details.
- `positionMintAddress`: The mint address of the liquidity position to close.

## Returns
A `Promise` that resolves to a `string` containing the transaction ID of the transaction

## Notes
- The function uses Orca's SDK to interact with the specified Whirlpool and close the liquidity position.
- A maximum slippage of 1% is assumed for liquidity provision during the position closing.
- The function automatically fetches the associated Whirlpool address and position details using the provided mint address.

## Throws
An error will be thrown if:
- The specified position mint address is invalid or inaccessible.
- The transaction fails to send.
- Any required position or Whirlpool data cannot be fetched.

##### Parameters

###### agent

`SolanaAgentKit`

The `SolanaAgentKit` instance representing the wallet and connection.

###### positionMintAddress

`PublicKey`

The mint address of the liquidity position to close.

##### Returns

`Promise`\<`string`\>

A promise resolving to the transaction ID (`string`).

#### methods.orcaCreateCLMM()

> **methods.orcaCreateCLMM**: (`agent`, `mintDeploy`, `mintPair`, `initialPrice`, `feeTier`) => `Promise`\<`string`\>

# Creates a CLMM Pool (Concentrated Liquidity Market Maker Pool).

This function initializes a new Whirlpool (CLMM Pool) on Orca. It only sets up the pool and does not seed it with liquidity.

## Example Usage:
Suppose you want to create a CLMM pool with two tokens, SHARK and USDC, and set the initial price of SHARK to 0.001 USDC.
You would call this function with `mintA` as SHARK's mint address and `mintB` as USDC's mint address. The pool is created
with the specified fee tier and tick spacing associated with that fee tier.

### Note for Experts:
The Whirlpool program determines the token mint order, which might not match your expectation. This function
adjusts the input order as needed and inverts the initial price accordingly.

##### Parameters

###### agent

`SolanaAgentKit`

The `SolanaAgentKit` instance representing the wallet and connection details.

###### mintDeploy

`PublicKey`

The mint of the token you want to deploy (e.g., SHARK).

###### mintPair

`PublicKey`

The mint of the token you want to pair the deployed mint with (e.g., USDC).

###### initialPrice

`Decimal`

The initial price of `mintDeploy` in terms of `mintPair`.

###### feeTier

The fee tier bps for the pool, determining tick spacing and fee collection rates.

`1` | `2` | `4` | `5` | `16` | `30` | `65` | `100` | `200`

##### Returns

`Promise`\<`string`\>

A promise that resolves to a transaction ID (`string`) of the transaction creating the pool.

##### Throws

Will throw an error if:
- Mint accounts for the tokens cannot be fetched.
- The network is unsupported.

##### Remarks

This function only initializes the CLMM pool and does not add liquidity. For adding liquidity, you can use
a separate function after the pool is successfully created.
```

#### methods.orcaCreateSingleSidedLiquidityPool()

> **methods.orcaCreateSingleSidedLiquidityPool**: (`agent`, `depositTokenAmount`, `depositTokenMint`, `otherTokenMint`, `initialPrice`, `maxPrice`, `feeTierBps`) => `Promise`\<`string`\>

# Creates a single-sided liquidity pool.

This function initializes a new Whirlpool (liquidity pool) on Orca and seeds it with liquidity from a single token.

## Example Usage:
You created a new token called SHARK, and you want to set the initial price to 0.001 USDC.
You set `depositTokenMint` to SHARK's mint address and `otherTokenMint` to USDC's mint address.
You can minimize price impact for buyers in a few ways:
1. Increase the amount of tokens you deposit
2. Set the initial price very low
3. Set the maximum price closer to the initial price

### Note for experts:
The Whirlpool program initializes the Whirlpool in a specific order. This might not be
the order you expect, so the function checks the order and adjusts the inverts the prices. This means that
on-chain the Whirlpool might be configured as USDC/SHARK instead of SHARK/USDC, and the on-chain price will
be 1/`initialPrice`. This will not affect the price of the token as you intended it to be.

##### Parameters

###### agent

`SolanaAgentKit`

The `SolanaAgentKit` instance representing the wallet and connection details.

###### depositTokenAmount

`number`

The amount of the deposit token to deposit in the pool.

###### depositTokenMint

`PublicKey`

The mint address of the token being deposited into the pool, eg. SHARK.

###### otherTokenMint

`PublicKey`

The mint address of the other token in the pool, eg. USDC.

###### initialPrice

`Decimal`

The initial price of the deposit token in terms of the other token.

###### maxPrice

`Decimal`

The maximum price at which liquidity is added.

###### feeTierBps

`1` | `2` | `4` | `5` | `16` | `30` | `65` | `100` | `200`

##### Returns

`Promise`\<`string`\>

A promise that resolves to a transaction ID (`string`) of the transaction creating the pool.

##### Throws

Will throw an error if:
- Mint accounts for the tokens cannot be fetched.
- Prices are out of bounds.

##### Remarks

This function is designed for single-sided deposits where users only contribute one type of token,
and the function manages mint order and necessary calculations.

#### methods.orcaFetchPositions()

> **methods.orcaFetchPositions**: (`agent`) => `Promise`\<`string`\>

# Fetches Liquidity Position Data in Orca Whirlpools

Fetches data for all liquidity positions owned by the provided wallet, including:
- Whirlpool address.
- Whether the position is in range.
- Distance from the center price to the current price in basis points.

## Parameters
- `agent`: The `SolanaAgentKit` instance representing the wallet and connection.

## Returns
A JSON string with an object mapping position mint addresses to position details:
```json
{
  "positionMintAddress1": {
    "whirlpoolAddress": "whirlpoolAddress1",
    "positionInRange": true,
    "distanceFromCenterBps": 250
  }
}
```

## Throws
- If positions cannot be fetched or processed.
- If the position mint address is invalid.

##### Parameters

###### agent

`SolanaAgentKit`

The `SolanaAgentKit` instance.

##### Returns

`Promise`\<`string`\>

A JSON string with position data.

#### methods.orcaOpenCenteredPositionWithLiquidity()

> **methods.orcaOpenCenteredPositionWithLiquidity**: (`agent`, `whirlpoolAddress`, `priceOffsetBps`, `inputTokenMint`, `inputAmount`) => `Promise`\<`string`\>

# Opens a Centered Liquidity Position in an Orca Whirlpool

This function opens a centered liquidity position in a specified Orca Whirlpool. The user defines
a basis point (bps) offset from the current price of the pool to set the lower and upper bounds of the position.
The user also specifies the token mint and the amount to deposit. The required amount of the other token
is calculated automatically.

## Parameters
- `agent`: The `SolanaAgentKit` instance representing the wallet and connection details.
- `whirlpoolAddress`: The address of the Orca Whirlpool where the position will be opened.
- `priceOffsetBps`: The basis point (bps) offset (on one side) from the current price of the pool. For example,
  500 bps (5%) creates a range from 95% to 105% of the current pool price.
- `inputTokenMint`: The mint address of the token being deposited (e.g., USDC or another token).
- `inputAmount`: The amount of the input token to deposit, specified as a `Decimal` value.

## Returns
A `Promise` that resolves to the transaction ID (`string`) of the transaction that opens the position.

## Notes
- The `priceOffsetBps` specifies the range symmetrically around the current price.
- The specified `inputTokenMint` determines which token is deposited directly. The function calculates
  the required amount of the other token based on the specified price range.
- This function supports Orca's token extensions for managing tokens with special behaviors.
- The function assumes a maximum slippage of 1% for liquidity provision.

## Throws
An error will be thrown if:
- The specified Whirlpool address is invalid or inaccessible.
- The transaction fails to send.
- Any required mint information cannot be fetched.

##### Parameters

###### agent

`SolanaAgentKit`

The `SolanaAgentKit` instance representing the wallet and connection.

###### whirlpoolAddress

`PublicKey`

The address of the Orca Whirlpool.

###### priceOffsetBps

`number`

The basis point offset (one side) from the current pool price.

###### inputTokenMint

`PublicKey`

The mint address of the token to deposit.

###### inputAmount

`Decimal`

The amount of the input token to deposit.

##### Returns

`Promise`\<`string`\>

A promise resolving to the transaction ID (`string`).

#### methods.orcaOpenSingleSidedPosition()

> **methods.orcaOpenSingleSidedPosition**: (`agent`, `whirlpoolAddress`, `distanceFromCurrentPriceBps`, `widthBps`, `inputTokenMint`, `inputAmount`) => `Promise`\<`string`\>

# Opens a Single-Sided Liquidity Position in an Orca Whirlpool

This function opens a single-sided liquidity position in a specified Orca Whirlpool. The user specifies
a basis point (bps) offset from the current price for the lower bound and a width (bps) for the range width.
The required amount of the other token is calculated automatically.

## Parameters
- `agent`: The `SolanaAgentKit` instance representing the wallet and connection details.
- `whirlpoolAddress`: The address of the Orca Whirlpool where the position will be opened.
- `distanceFromCurrentPriceBps`: The basis point offset from the current price for the lower bound.
- `widthBps`: The width of the range as a percentage increment from the lower bound.
- `inputTokenMint`: The mint address of the token being deposited (e.g., USDC or another token).
- `inputAmount`: The amount of the input token to deposit, specified as a `Decimal` value.

## Returns
A `Promise` that resolves to the transaction ID (`string`) of the transaction that opens the position.

## Notes
- The `distanceFromCurrentPriceBps` specifies the starting point of the range.
- The `widthBps` determines the range size from the lower bound.
- The specified `inputTokenMint` determines which token is deposited directly.

##### Parameters

###### agent

`SolanaAgentKit`

The `SolanaAgentKit` instance representing the wallet and connection.

###### whirlpoolAddress

`PublicKey`

The address of the Orca Whirlpool.

###### distanceFromCurrentPriceBps

`number`

The basis point offset from the current price for the lower bound.

###### widthBps

`number`

The width of the range as a percentage increment from the lower bound.

###### inputTokenMint

`PublicKey`

The mint address of the token to deposit.

###### inputAmount

`Decimal`

The amount of the input token to deposit.

##### Returns

`Promise`\<`string`\>

A promise resolving to the transaction ID (`string`).

#### methods.raydiumCreateAmmV4()

> **methods.raydiumCreateAmmV4**: (`agent`, `marketId`, `baseAmount`, `quoteAmount`, `startTime`) => `Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

##### Parameters

###### agent

`SolanaAgentKit`

###### marketId

`PublicKey`

###### baseAmount

`BN`

###### quoteAmount

`BN`

###### startTime

`BN`

##### Returns

`Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

#### methods.raydiumCreateClmm()

> **methods.raydiumCreateClmm**: (`agent`, `mint1`, `mint2`, `configId`, `initialPrice`, `startTime`) => `Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

##### Parameters

###### agent

`SolanaAgentKit`

###### mint1

`PublicKey`

###### mint2

`PublicKey`

###### configId

`PublicKey`

###### initialPrice

`Decimal`

###### startTime

`BN`

##### Returns

`Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

#### methods.raydiumCreateCpmm()

> **methods.raydiumCreateCpmm**: (`agent`, `mintA`, `mintB`, `configId`, `mintAAmount`, `mintBAmount`, `startTime`) => `Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

##### Parameters

###### agent

`SolanaAgentKit`

###### mintA

`PublicKey`

###### mintB

`PublicKey`

###### configId

`PublicKey`

###### mintAAmount

`BN`

###### mintBAmount

`BN`

###### startTime

`BN`

##### Returns

`Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

#### methods.requestUnstakeFromDriftInsuranceFund()

> **methods.requestUnstakeFromDriftInsuranceFund**: (`agent`, `amount`, `symbol`) => `Promise`\<`string`\>

Request an unstake from the drift insurance fund

##### Parameters

###### agent

`SolanaAgentKit`

###### amount

`number`

###### symbol

`string`

##### Returns

`Promise`\<`string`\>

#### methods.requestWithdrawalFromVault()

> **methods.requestWithdrawalFromVault**: (`agent`, `amount`, `vault`) => `Promise`\<`string`\>

Request a withdrawal from a vault. If successful redemption period starts and the user can redeem the tokens after the period ends

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### amount

`number`

Amount to withdraw from the vault (in shares)

###### vault

`string`

Vault address

##### Returns

`Promise`\<`string`\>

#### methods.sanctumAddLiquidity()

> **methods.sanctumAddLiquidity**: (`agent`, `lstMint`, `amount`, `quotedAmount`, `priorityFee`) => `Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Add Liquidity to a Sanctum infinite-LST pool

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### lstMint

`string`

mint address of the LST

###### amount

`string`

amount of LST to add

###### quotedAmount

`string`

amount of the INF token to mint

###### priorityFee

`number`

priority fee for the transaction

##### Returns

`Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

transaction signature

#### methods.sanctumGetLSTAPY()

> **methods.sanctumGetLSTAPY**: (`inputs`) => `Promise`\<\{ `apys`: `Record`\<`string`, `number`\>; \}\>

##### Parameters

###### inputs

`string`[]

##### Returns

`Promise`\<\{ `apys`: `Record`\<`string`, `number`\>; \}\>

APY of the LST

#### methods.sanctumGetLSTPrice()

> **methods.sanctumGetLSTPrice**: (`inputs`) => `Promise`\<`object`[]\>

##### Parameters

###### inputs

`string`[]

##### Returns

`Promise`\<`object`[]\>

Price of the mints

#### methods.sanctumGetLSTTVL()

> **methods.sanctumGetLSTTVL**: (`inputs`) => `Promise`\<\{ `tvls`: `Record`\<`string`, `string`\>; \}\>

##### Parameters

###### inputs

`string`[]

##### Returns

`Promise`\<\{ `tvls`: `Record`\<`string`, `string`\>; \}\>

TVL of the LST

#### methods.sanctumGetOwnedLST()

> **methods.sanctumGetOwnedLST**: (`agent`) => `Promise`\<`object`[]\>

##### Parameters

###### agent

`SolanaAgentKit`

##### Returns

`Promise`\<`object`[]\>

#### methods.sanctumRemoveLiquidity()

> **methods.sanctumRemoveLiquidity**: (`agent`, `lstMint`, `amount`, `quotedAmount`, `priorityFee`) => `Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Remove Liquidity to a Sanctum infinite-LST pool

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### lstMint

`string`

mint address of the LST

###### amount

`string`

amount of LST to remove

###### quotedAmount

`string`

amount of the INF token to burn

###### priorityFee

`number`

priority fee for the transaction

##### Returns

`Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

transaction signature

#### methods.sanctumSwapLST()

> **methods.sanctumSwapLST**: (`agent`, `inputLstMint`, `amount`, `quotedAmount`, `priorityFee`, `outputLstMint`) => `Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

##### Parameters

###### agent

`SolanaAgentKit`

###### inputLstMint

`string`

###### amount

`string`

###### quotedAmount

`string`

###### priorityFee

`number`

###### outputLstMint

`string`

##### Returns

`Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

#### methods.stakeToDriftInsuranceFund()

> **methods.stakeToDriftInsuranceFund**: (`agent`, `amount`, `symbol`) => `Promise`\<`string`\>

Stake a token to the drift insurance fund

##### Parameters

###### agent

`SolanaAgentKit`

###### amount

`number`

###### symbol

`string`

##### Returns

`Promise`\<`string`\>

#### methods.stakeWithSolayer()

> **methods.stakeWithSolayer**: (`agent`, `amount`) => `Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Stake SOL with Solayer

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### amount

`number`

Amount of SOL to stake

##### Returns

`Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Transaction signature

#### methods.swapSpotToken()

> **methods.swapSpotToken**: (`agent`, `params`) => `Promise`\<`string`\>

Swap a spot token for another on drift

##### Parameters

###### agent

`SolanaAgentKit`

###### params

`object` & \{ `fromAmount`: `number`; \} \| \{ `toAmount`: `number`; \}

##### Returns

`Promise`\<`string`\>

#### methods.tradeDriftVault()

> **methods.tradeDriftVault**: (`agent`, `vault`, `amount`, `symbol`, `action`, `type`, `price?`) => `Promise`\<`TxSigAndSlot`\>

Carry out a trade with a delegated vault

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### vault

`string`

Vault address

###### amount

`number`

Amount to trade (in tokens)

###### symbol

`string`

Symbol of the token to trade

###### action

Action to take (e.g. "buy" or "sell")

`"long"` | `"short"`

###### type

Type of trade (e.g. "market" or "limit")

`"market"` | `"limit"`

###### price?

`number`

##### Returns

`Promise`\<`TxSigAndSlot`\>

#### methods.unstakeFromDriftInsuranceFund()

> **methods.unstakeFromDriftInsuranceFund**: (`agent`, `symbol`) => `Promise`\<`string`\>

Unstake requested funds from the drift insurance fund once cool down period is elapsed

##### Parameters

###### agent

`SolanaAgentKit`

###### symbol

`string`

##### Returns

`Promise`\<`string`\>

#### methods.updateDriftVaultDelegate()

> **methods.updateDriftVaultDelegate**: (`agent`, `vault`, `delegateAddress`) => `Promise`\<`string`\> = `updateVaultDelegate`

##### Parameters

###### agent

`SolanaAgentKit`

###### vault

`string`

###### delegateAddress

`string`

##### Returns

`Promise`\<`string`\>

#### methods.updateVault()

> **methods.updateVault**: (`agent`, `vault`, `params`) => `Promise`\<`string`\>

Update the vault's info

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### vault

`string`

Vault address

###### params

Vault update parameters

###### hurdleRate?

`number`

Hurdle rate percentage

###### managementFee?

`number`

Management fee percentage (e.g 2 == 2%)

###### maxTokens?

`number`

Maximum amount that can be deposited into the vault (in tokens)

###### minDepositAmount?

`number`

Minimum amount that can be deposited into the vault (in tokens)

###### permissioned?

`boolean`

Whether the vault uses a whitelist

###### profitShare?

`number`

Profit share percentage (e.g 20 == 20%)

###### redeemPeriod?

`number`

Redeem period in seconds

##### Returns

`Promise`\<`string`\>

Promise&lt;anchor.Web3.TransactionSignature&gt; - The transaction signature of the vault update

#### methods.validateAndEncodeDriftAddress()

> **methods.validateAndEncodeDriftAddress**: (`input`, `programId`) => `PublicKey` = `validateAndEncodeAddress`

##### Parameters

###### input

`string`

###### programId

`string`

##### Returns

`PublicKey`

#### methods.voltrDepositStrategy()

> **methods.voltrDepositStrategy**: (`agent`, `depositAmount`, `vault`, `strategy`) => `Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Deposits assets into a Voltr strategy

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### depositAmount

`BN`

Amount to deposit in base units (BN)

###### vault

`PublicKey`

Public key of the target vault

###### strategy

`PublicKey`

Public key of the target strategy

##### Returns

`Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Transaction signature for the deposit

#### methods.voltrGetPositionValues()

> **methods.voltrGetPositionValues**: (`agent`, `vault`) => `Promise`\<`string`\>

Gets the value of assets in a Voltr vault

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### vault

`PublicKey`

Public key of the target vault

##### Returns

`Promise`\<`string`\>

Position and total values for the vault

#### methods.voltrWithdrawStrategy()

> **methods.voltrWithdrawStrategy**: (`agent`, `withdrawAmount`, `vault`, `strategy`) => `Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Withdraws assets from a Voltr strategy

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### withdrawAmount

`BN`

Amount to withdraw in base units (BN)

###### vault

`PublicKey`

Public key of the target vault

###### strategy

`PublicKey`

Public key of the target strategy

##### Returns

`Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Transaction signature for the deposit

#### methods.withdrawAll()

> **methods.withdrawAll**: (`agent`, `marketId`) => `Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Withdraws all funds from Manifest

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### marketId

`PublicKey`

Public key for the manifest market

##### Returns

`Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Transaction signature

#### methods.withdrawFromDriftUserAccount()

> **methods.withdrawFromDriftUserAccount**: (`agent`, `amount`, `symbol`, `isBorrow`) => `Promise`\<`TxSigAndSlot`\>

##### Parameters

###### agent

`SolanaAgentKit`

###### amount

`number`

###### symbol

`string`

###### isBorrow

`boolean` = `false`

##### Returns

`Promise`\<`TxSigAndSlot`\>

#### methods.withdrawFromDriftVault()

> **methods.withdrawFromDriftVault**: (`agent`, `vault`) => `Promise`\<`string`\>

Withdraw tokens once the redemption period has elapsed.

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### vault

`string`

Vault address

##### Returns

`Promise`\<`string`\>

Promise&lt;anchor.Web3.TransactionSignature&gt; - The transaction signature of the redemption

### name

> **name**: `string` = `"defi"`
