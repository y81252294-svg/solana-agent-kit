[**Documentation v2**](../../../README.md)

***

[Documentation](../../../README.md) / [@solana-agent-kit/plugin-nft](../README.md) / default

# Variable: default

> `const` **default**: `object`

Defined in: [packages/plugin-nft/src/index.ts:44](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/plugin-nft/src/index.ts#L44)

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

#### methods.cancelListing()

> **methods.cancelListing**: (`agent`, `nftMint`) => `Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

##### Parameters

###### agent

`SolanaAgentKit`

###### nftMint

`PublicKey`

##### Returns

`Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

#### methods.create3LandCollection()

> **methods.create3LandCollection**: (`optionsWithBase58`, `collectionOpts`, `priorityFeeParam?`) => `Promise`\<`string` \| \{ `error`: `unknown`; `success`: `boolean`; \}\> = `createCollection`

Create a collection on 3Land

##### Parameters

###### optionsWithBase58

`StoreInitOptions`

represents the privateKey of the wallet - can be an array of numbers, Uint8Array or base58 string

###### collectionOpts

`CreateCollectionOptions`

represents the options for the collection creation

###### priorityFeeParam?

`number`

##### Returns

`Promise`\<`string` \| \{ `error`: `unknown`; `success`: `boolean`; \}\>

#### methods.create3LandSingle()

> **methods.create3LandSingle**: (`optionsWithBase58`, `collectionAccount`, `createItemOptions`, `isMainnet`, `withPool`, `priorityFeeParam?`) => `Promise`\<\{ `payerPublicKey`: `string`; `transactionId`: `string`; \}\> = `createSingle`

Create a single edition on 3Land

##### Parameters

###### optionsWithBase58

`StoreInitOptions`

represents the privateKey of the wallet - can be an array of numbers, Uint8Array or base58 string

###### collectionAccount

`string`

represents the account for the nft collection

###### createItemOptions

`CreateSingleOptions`

the options for the creation of the single NFT listing

###### isMainnet

`boolean` = `false`

###### withPool

`boolean` = `false`

###### priorityFeeParam?

`number`

##### Returns

`Promise`\<\{ `payerPublicKey`: `string`; `transactionId`: `string`; \}\>

#### methods.deployCollection()

> **methods.deployCollection**: (`agent`, `options`) => `Promise`\<\{ `collectionAddress`: `PublicKey`; `signature`: `undefined`; `signedTransaction`: `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]; \} \| \{ `collectionAddress`: `PublicKey`; `signature`: `string`; `signedTransaction`: `undefined`; \}\> = `deploy_collection`

Deploy a new NFT collection

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### options

`CollectionOptions`

Collection options including name, URI, royalties, and creators

##### Returns

`Promise`\<\{ `collectionAddress`: `PublicKey`; `signature`: `undefined`; `signedTransaction`: `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]; \} \| \{ `collectionAddress`: `PublicKey`; `signature`: `string`; `signedTransaction`: `undefined`; \}\>

Object containing collection address and metadata

#### methods.deployToken()

> **methods.deployToken**: (`agent`, `name`, `uri`, `symbol`, `authority?`, `decimals`, `initialSupply?`) => `Promise`\<`Transaction` \| \{ `mint`: `PublicKey`; \}\> = `deploy_token`

Deploy a new SPL token

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### name

`string`

Name of the token

###### uri

`string`

URI for the token metadata

###### symbol

`string`

Symbol of the token

###### authority?

`SPLAuthorityInput`

###### decimals?

`number` = `9`

Number of decimals for the token (default: 9)

###### initialSupply?

`number`

Initial supply to mint (optional)

##### Returns

`Promise`\<`Transaction` \| \{ `mint`: `PublicKey`; \}\>

Object containing token mint address and initial account (if supply was minted)

#### methods.deployToken2022()

> **methods.deployToken2022**: (`agent`, `name`, `uri`, `symbol`, `decimals`, `initialSupply?`) => `Promise`\<\{ `mint`: `PublicKey`; \}\> = `deploy_token2022`

Deploy a new SPL token

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### name

`string`

Name of the token

###### uri

`string`

URI for the token metadata

###### symbol

`string`

Symbol of the token

###### decimals

`number` = `9`

Number of decimals for the token (default: 9)

###### initialSupply?

`number`

Initial supply to mint (optional)

##### Returns

`Promise`\<\{ `mint`: `PublicKey`; \}\>

Object containing token mint address and initial account (if supply was minted)

#### methods.getAsset()

> **methods.getAsset**: (`agent`, `assetId`) => `Promise`\<`DasApiAsset`\> = `get_asset`

Fetch asset details using the Metaplex DAS API

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### assetId

`string`

ID of the asset to fetch

##### Returns

`Promise`\<`DasApiAsset`\>

Asset details

#### methods.getAssetsByAuthority()

> **methods.getAssetsByAuthority**: (`agent`, `params`) => `Promise`\<`DasApiAssetList`\> = `get_assets_by_authority`

Fetch assets by authority using the Metaplex DAS API

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### params

`GetAssetsByAuthorityRpcInput`

Parameters for fetching assets by authority

##### Returns

`Promise`\<`DasApiAssetList`\>

List of assets associated with the given authority

#### methods.getAssetsByCreator()

> **methods.getAssetsByCreator**: (`agent`, `params`) => `Promise`\<`DasApiAssetList`\> = `get_assets_by_creator`

Fetch assets by creator using the Metaplex DAS API

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### params

`GetAssetsByCreatorRpcInput`

Parameters for fetching assets by creator

##### Returns

`Promise`\<`DasApiAssetList`\>

List of assets created by the specified creator

#### methods.listNFTForSale()

> **methods.listNFTForSale**: (`agent`, `nftMint`, `price`) => `Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

##### Parameters

###### agent

`SolanaAgentKit`

###### nftMint

`PublicKey`

###### price

`number`

##### Returns

`Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

#### methods.mintCollectionNFT()

> **methods.mintCollectionNFT**: (`agent`, `collectionMint`, `metadata`, `recipient?`) => `Promise`\<\{ `metadata`: `PublicKey`; `mint`: `PublicKey`; `signature`: `undefined`; `signedTransaction`: `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]; \} \| \{ `metadata`: `PublicKey`; `mint`: `PublicKey`; `signature`: `string`; `signedTransaction`: `undefined`; \}\> = `mintCollectionNFT`

Mint a new NFT as part of an existing collection

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### collectionMint

`PublicKey`

Address of the collection's master NFT

###### metadata

NFT metadata object

###### creators?

`object`[]

###### name

`string`

###### sellerFeeBasisPoints?

`number`

###### uri

`string`

###### recipient?

`PublicKey`

Optional recipient address (defaults to wallet address)

##### Returns

`Promise`\<\{ `metadata`: `PublicKey`; `mint`: `PublicKey`; `signature`: `undefined`; `signedTransaction`: `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]; \} \| \{ `metadata`: `PublicKey`; `mint`: `PublicKey`; `signature`: `string`; `signedTransaction`: `undefined`; \}\>

Object containing NFT mint address and token account

#### methods.searchAssets()

> **methods.searchAssets**: (`agent`, `params`) => `Promise`\<`DasApiAssetList`\> = `search_assets`

Search for assets using the Metaplex DAS API

##### Parameters

###### agent

`SolanaAgentKit`

SolanaAgentKit instance

###### params

`SearchAssetsRpcInput`

Parameters for searching assets

##### Returns

`Promise`\<`DasApiAssetList`\>

List of assets matching the search criteria

### name

> **name**: `string` = `"nft"`
