[**Documentation v2**](../../../README.md)

***

[Documentation](../../../README.md) / [@solana-agent-kit/plugin-token](../README.md) / default

# Variable: default

> `const` **default**: `object`

Defined in: [index.ts:84](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/plugin-token/src/index.ts#L84)

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

#### methods.burnTokensUsingSolutiofi()

> **methods.burnTokensUsingSolutiofi**: (`agent`, `mints`) => `Promise`\<(`string` \| `VersionedTransaction` \| `VersionedTransaction`[] \| `Transaction` \| `Transaction`[])[]\> = `burnTokens`

Burns tokens using SolutioFi

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### mints

`string`[]

Array of mint addresses for the tokens to burn

##### Returns

`Promise`\<(`string` \| `VersionedTransaction` \| `VersionedTransaction`[] \| `Transaction` \| `Transaction`[])[]\>

Array of versioned transactions

#### methods.cancelJupiterLimitOrders()

> **methods.cancelJupiterLimitOrders**: (`agent`, `params`) => `Promise`\<\{ `signatures`: `string` \| `VersionedTransaction` \| `VersionedTransaction`[] \| `Transaction` \| `Transaction`[]; `success`: `boolean`; \}\>

##### Parameters

###### agent

`SolanaAgentKit`

###### params

`CancelJupiterOrderRequest`

##### Returns

`Promise`\<\{ `signatures`: `string` \| `VersionedTransaction` \| `VersionedTransaction`[] \| `Transaction` \| `Transaction`[]; `success`: `boolean`; \}\>

#### methods.closeAccountsUsingSolutiofi()

> **methods.closeAccountsUsingSolutiofi**: (`agent`, `mints`) => `Promise`\<(`string` \| `VersionedTransaction` \| `VersionedTransaction`[] \| `Transaction` \| `Transaction`[])[]\> = `closeAccounts`

Close token accounts

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### mints

`string`[]

Array of mint addresses to close

##### Returns

`Promise`\<(`string` \| `VersionedTransaction` \| `VersionedTransaction`[] \| `Transaction` \| `Transaction`[])[]\>

#### methods.closeEmptyTokenAccounts()

> **methods.closeEmptyTokenAccounts**: (`agent`) => `Promise`\<\{ `signature`: `string`; `signedTransaction`: `undefined`; `size`: `number`; \} \| \{ `signature`: `undefined`; `signedTransaction`: `Transaction`; `size`: `number`; \}\>

Close Empty SPL Token accounts of the agent

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

##### Returns

`Promise`\<\{ `signature`: `string`; `signedTransaction`: `undefined`; `size`: `number`; \} \| \{ `signature`: `undefined`; `signedTransaction`: `Transaction`; `size`: `number`; \}\>

transaction signature and total number of accounts closed

#### methods.createJupiterLimitOrder()

> **methods.createJupiterLimitOrder**: (`agent`, `params`) => `Promise`\<\{ `order`: `string`; `signature`: `string` \| `VersionedTransaction` \| `VersionedTransaction`[] \| `Transaction` \| `Transaction`[]; `success`: `boolean`; \}\>

##### Parameters

###### agent

`SolanaAgentKit`

###### params

`CreateJupiterOrderRequest`

##### Returns

`Promise`\<\{ `order`: `string`; `signature`: `string` \| `VersionedTransaction` \| `VersionedTransaction`[] \| `Transaction` \| `Transaction`[]; `success`: `boolean`; \}\>

#### methods.fetchPrice()

> **methods.fetchPrice**: (`tokenId`) => `Promise`\<`string`\>

Fetch the price of a given token quoted in USDC using Jupiter API

##### Parameters

###### tokenId

`PublicKey`

The token mint address

##### Returns

`Promise`\<`string`\>

The price of the token quoted in USDC

#### methods.fetchPythPrice()

> **methods.fetchPythPrice**: (`feedID`) => `Promise`\<`string`\>

Fetch the price of a given price feed from Pyth

##### Parameters

###### feedID

`string`

##### Returns

`Promise`\<`string`\>

Latest price value from feed

You can find priceFeedIDs here: https://www.pyth.network/developers/price-feed-ids#stable

#### methods.fetchPythPriceFeedID()

> **methods.fetchPythPriceFeedID**: (`tokenSymbol`) => `Promise`\<`string`\>

Fetch the price feed ID for a given token symbol from Pyth

##### Parameters

###### tokenSymbol

`string`

Token symbol

##### Returns

`Promise`\<`string`\>

Price feed ID

#### methods.fetchTokenDetailedReport()

> **methods.fetchTokenDetailedReport**: (`mint`) => `Promise`\<`TokenCheck`\>

Fetches a detailed report for a specific token.

##### Parameters

###### mint

`string`

The mint address of the token.

##### Returns

`Promise`\<`TokenCheck`\>

The detailed token report.

##### Throws

If the API call fails.

#### methods.fetchTokenReportSummary()

> **methods.fetchTokenReportSummary**: (`mint`) => `Promise`\<`TokenCheck`\>

Fetches a summary report for a specific token.

##### Parameters

###### mint

`string`

The mint address of the token.

##### Returns

`Promise`\<`TokenCheck`\>

The token summary report.

##### Throws

If the API call fails.

#### methods.get\_balance()

> **methods.get\_balance**: (`agent`, `token_address?`) => `Promise`\<`number`\>

Get the balance of SOL or an SPL token for the agent's wallet

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### token\_address?

`PublicKey`

Optional SPL token mint address. If not provided, returns SOL balance

##### Returns

`Promise`\<`number`\>

Promise resolving to the balance as a number (in UI units) or null if account doesn't exist

#### methods.get\_balance\_other()

> **methods.get\_balance\_other**: (`agent`, `wallet_address`, `token_address?`) => `Promise`\<`number`\>

Get the balance of SOL or an SPL token for the specified wallet address (other than the agent's wallet)

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### wallet\_address

`PublicKey`

Public key of the wallet to check balance for

###### token\_address?

`PublicKey`

Optional SPL token mint address. If not provided, returns SOL balance

##### Returns

`Promise`\<`number`\>

Promise resolving to the balance as a number (in UI units) or 0 if account doesn't exist

#### methods.get\_token\_balance()

> **methods.get\_token\_balance**: (`agent`, `walletAddress?`) => `Promise`\<\{ `sol`: `number`; `tokens`: `object`[]; \}\>

Get the token balances of a Solana wallet

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### walletAddress?

`PublicKey`

##### Returns

`Promise`\<\{ `sol`: `number`; `tokens`: `object`[]; \}\>

Promise resolving to the balance as an object containing sol balance and token balances with their respective mints, symbols, names and decimals

#### methods.getJupiterLimitOrderHistory()

> **methods.getJupiterLimitOrderHistory**: (`agent`) => `Promise`\<\{ `history`: `JupiterOrderHistoryResponse`; `success`: `boolean`; \}\>

##### Parameters

###### agent

`SolanaAgentKit`

##### Returns

`Promise`\<\{ `history`: `JupiterOrderHistoryResponse`; `success`: `boolean`; \}\>

#### methods.getOpenJupiterLimitOrders()

> **methods.getOpenJupiterLimitOrders**: (`agent`) => `Promise`\<\{ `orders`: `OpenJupiterOrderResponse`[]; `success`: `boolean`; \}\>

##### Parameters

###### agent

`SolanaAgentKit`

##### Returns

`Promise`\<\{ `orders`: `OpenJupiterOrderResponse`[]; `success`: `boolean`; \}\>

#### methods.getTokenAddressFromTicker()

> **methods.getTokenAddressFromTicker**: (`ticker`) => `Promise`\<`null` \| `string`\>

##### Parameters

###### ticker

`string`

##### Returns

`Promise`\<`null` \| `string`\>

#### methods.getTokenDataByAddress()

> **methods.getTokenDataByAddress**: (`mint`) => `Promise`\<`undefined` \| `JupiterTokenData`\>

##### Parameters

###### mint

`PublicKey`

##### Returns

`Promise`\<`undefined` \| `JupiterTokenData`\>

#### methods.getTPS()

> **methods.getTPS**: (`agent`) => `Promise`\<`number`\>

##### Parameters

###### agent

`SolanaAgentKit`

##### Returns

`Promise`\<`number`\>

#### methods.getWalletAddress()

> **methods.getWalletAddress**: (`agent`) => `string`

##### Parameters

###### agent

`SolanaAgentKit`

##### Returns

`string`

#### methods.launchPumpFunToken()

> **methods.launchPumpFunToken**: (`agent`, `tokenName`, `tokenTicker`, `description`, `imageUrl`, `options?`) => `Promise`\<\{ `metadataUri`: `any`; `mint`: `string`; `signature`: `undefined`; `signedTransaction`: `VersionedTransaction`; \} \| \{ `metadataUri`: `any`; `mint`: `string`; `signature`: `string`; `signedTransaction`: `undefined`; \}\>

Launch a token on Pump.fun

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### tokenName

`string`

Name of the token

###### tokenTicker

`string`

Ticker of the token

###### description

`string`

Description of the token

###### imageUrl

`string`

URL of the token image

###### options?

`PumpFunTokenOptions`

Optional token options (twitter, telegram, website, initialLiquiditySOL, slippageBps, priorityFee)

##### Returns

`Promise`\<\{ `metadataUri`: `any`; `mint`: `string`; `signature`: `undefined`; `signedTransaction`: `VersionedTransaction`; \} \| \{ `metadataUri`: `any`; `mint`: `string`; `signature`: `string`; `signedTransaction`: `undefined`; \}\>

- Signature of the transaction, mint address and metadata URI, if successful, else error

#### methods.mergeTokensUsingSolutiofi()

> **methods.mergeTokensUsingSolutiofi**: (`agent`, `inputAssets`, `outputMint`, `priorityFee`) => `Promise`\<(`string` \| `VersionedTransaction` \| `VersionedTransaction`[] \| `Transaction` \| `Transaction`[])[]\> = `mergeTokens`

Merge multiple tokens into one

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### inputAssets

`InputAssetStruct`[]

Array of input assets to merge

###### outputMint

`string`

Output token mint address

###### priorityFee

`PriorityFee`

Transaction priority level

##### Returns

`Promise`\<(`string` \| `VersionedTransaction` \| `VersionedTransaction`[] \| `Transaction` \| `Transaction`[])[]\>

#### methods.request\_faucet\_funds()

> **methods.request\_faucet\_funds**: (`agent`) => `Promise`\<`string`\>

Request SOL from the Solana faucet (devnet/testnet only)

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

##### Returns

`Promise`\<`string`\>

Transaction signature

##### Throws

Error if the request fails or times out

#### methods.sendCompressedAirdrop()

> **methods.sendCompressedAirdrop**: (`agent`, `mintAddress`, `amount`, `decimals`, `recipients`, `priorityFeeInLamports`) => `Promise`\<`string` \| `VersionedTransaction` \| `VersionedTransaction`[] \| `Transaction` \| `Transaction`[]\>

Send airdrop with ZK Compressed Tokens.

##### Parameters

###### agent

`SolanaAgentKit`

Agent

###### mintAddress

`PublicKey`

SPL Mint address

###### amount

`number`

Amount to send per recipient

###### decimals

`number`

Decimals of the token

###### recipients

`PublicKey`[]

Recipient wallet addresses (no ATAs)

###### priorityFeeInLamports

`number`

Priority fee in lamports

##### Returns

`Promise`\<`string` \| `VersionedTransaction` \| `VersionedTransaction`[] \| `Transaction` \| `Transaction`[]\>

#### methods.spreadTokenUsingSolutiofi()

> **methods.spreadTokenUsingSolutiofi**: (`agent`, `inputAsset`, `targetTokens`, `priorityFee`) => `Promise`\<(`string` \| `VersionedTransaction` \| `VersionedTransaction`[] \| `Transaction` \| `Transaction`[])[]\> = `spreadToken`

Split a token into multiple tokens

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### inputAsset

`InputAssetStruct`

Input asset to spread

###### targetTokens

`TargetTokenStruct`[]

Array of target tokens and their allocations

###### priorityFee

`PriorityFee`

Transaction priority level

##### Returns

`Promise`\<(`string` \| `VersionedTransaction` \| `VersionedTransaction`[] \| `Transaction` \| `Transaction`[])[]\>

#### methods.stakeWithJup()

> **methods.stakeWithJup**: (`agent`, `amount`) => `Promise`\<`string` \| `VersionedTransaction` \| `VersionedTransaction`[] \| `Transaction` \| `Transaction`[]\>

Stake SOL with Jup validator

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### amount

`number`

Amount of SOL to stake

##### Returns

`Promise`\<`string` \| `VersionedTransaction` \| `VersionedTransaction`[] \| `Transaction` \| `Transaction`[]\>

Transaction signature

#### methods.swap()

> **methods.swap**: (`agent`, `amount`, `fromChain`, `fromToken`, `toChain`, `toToken`, `dstAddr`, `slippageBps`) => `Promise`\<`string`\>

##### Parameters

###### agent

`SolanaAgentKit`

###### amount

`string`

###### fromChain

`string`

###### fromToken

`string`

###### toChain

`string`

###### toToken

`string`

###### dstAddr

`string`

###### slippageBps

`number` | `"auto"`

##### Returns

`Promise`\<`string`\>

#### methods.trade()

> **methods.trade**: (`agent`, `outputMint`, `inputAmount`, `inputMint`, `_slippageBps`) => `Promise`\<`string` \| `VersionedTransaction` \| `VersionedTransaction`[] \| `Transaction` \| `Transaction`[]\>

Swap tokens using Jupiter Exchange

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### outputMint

`PublicKey`

Target token mint address

###### inputAmount

`number`

Amount to swap (in token decimals)

###### inputMint

`PublicKey` = `TOKENS.USDC`

Source token mint address (defaults to USDC)

###### \_slippageBps

`number` = `DEFAULT_OPTIONS.SLIPPAGE_BPS`

##### Returns

`Promise`\<`string` \| `VersionedTransaction` \| `VersionedTransaction`[] \| `Transaction` \| `Transaction`[]\>

Transaction signature

#### methods.transfer()

> **methods.transfer**: (`agent`, `to`, `amount`, `mint?`) => `Promise`\<`string` \| `VersionedTransaction` \| `VersionedTransaction`[] \| `Transaction` \| `Transaction`[]\>

Transfer SOL or SPL tokens to a recipient

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### to

`PublicKey`

Recipient's public key

###### amount

`number`

Amount to transfer

###### mint?

`PublicKey`

Optional mint address for SPL tokens

##### Returns

`Promise`\<`string` \| `VersionedTransaction` \| `VersionedTransaction`[] \| `Transaction` \| `Transaction`[]\>

Transaction signature

### name

> **name**: `string` = `"token"`
