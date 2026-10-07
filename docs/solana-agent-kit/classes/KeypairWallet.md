[**Documentation v2**](../../README.md)

***

[Documentation](../../README.md) / [solana-agent-kit](../README.md) / KeypairWallet

# Class: KeypairWallet

Defined in: [packages/core/src/utils/keypairWallet.ts:29](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/utils/keypairWallet.ts#L29)

A wallet implementation using a Keypair for signing transactions

## Implements

- [`BaseWallet`](../interfaces/BaseWallet.md)

## Constructors

### Constructor

> **new KeypairWallet**(`keypair`, `rpcUrl`): `KeypairWallet`

Defined in: [packages/core/src/utils/keypairWallet.ts:38](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/utils/keypairWallet.ts#L38)

Constructs a KeypairWallet with a given Keypair

#### Parameters

##### keypair

`Keypair`

The Keypair to use for signing transactions

##### rpcUrl

`string`

#### Returns

`KeypairWallet`

## Properties

### defaultOptions

> **defaultOptions**: `ConfirmOptions`

Defined in: [packages/core/src/utils/keypairWallet.ts:44](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/utils/keypairWallet.ts#L44)

***

### publicKey

> **publicKey**: `PublicKey`

Defined in: [packages/core/src/utils/keypairWallet.ts:30](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/utils/keypairWallet.ts#L30)

The public key of the connected wallet

#### Implementation of

[`BaseWallet`](../interfaces/BaseWallet.md).[`publicKey`](../interfaces/BaseWallet.md#publickey)

***

### rpcUrl

> **rpcUrl**: `string`

Defined in: [packages/core/src/utils/keypairWallet.ts:32](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/utils/keypairWallet.ts#L32)

## Methods

### sendTransaction()

> **sendTransaction**\<`T`\>(`transaction`): `Promise`\<`string`\>

Defined in: [packages/core/src/utils/keypairWallet.ts:74](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/utils/keypairWallet.ts#L74)

Sends a transaction on chain

#### Type Parameters

##### T

`T` *extends* `VersionedTransaction` \| `Transaction`

Transaction type (Transaction or VersionedTransaction)

#### Parameters

##### transaction

`T`

The transaction to be signed and sent

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`BaseWallet`](../interfaces/BaseWallet.md).[`sendTransaction`](../interfaces/BaseWallet.md#sendtransaction)

***

### signAllTransactions()

> **signAllTransactions**\<`T`\>(`txs`): `Promise`\<`T`[]\>

Defined in: [packages/core/src/utils/keypairWallet.ts:61](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/utils/keypairWallet.ts#L61)

Signs multiple transactions in batch

#### Type Parameters

##### T

`T` *extends* `VersionedTransaction` \| `Transaction`

Transaction type (Transaction or VersionedTransaction)

#### Parameters

##### txs

`T`[]

#### Returns

`Promise`\<`T`[]\>

Promise resolving to an array of signed transactions

#### Implementation of

[`BaseWallet`](../interfaces/BaseWallet.md).[`signAllTransactions`](../interfaces/BaseWallet.md#signalltransactions)

***

### signAndSendTransaction()

> **signAndSendTransaction**\<`T`\>(`transaction`, `options?`): `Promise`\<\{ `signature`: `string`; \}\>

Defined in: [packages/core/src/utils/keypairWallet.ts:93](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/utils/keypairWallet.ts#L93)

Signs and sends a transaction to the network

#### Type Parameters

##### T

`T` *extends* `VersionedTransaction` \| `Transaction`

Transaction type (Transaction or VersionedTransaction)

#### Parameters

##### transaction

`T`

The transaction to be signed and sent

##### options?

`SendOptions`

Optional transaction send configuration

#### Returns

`Promise`\<\{ `signature`: `string`; \}\>

Promise resolving to the transaction signature

#### Implementation of

[`BaseWallet`](../interfaces/BaseWallet.md).[`signAndSendTransaction`](../interfaces/BaseWallet.md#signandsendtransaction)

***

### signMessage()

> **signMessage**(`message`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [packages/core/src/utils/keypairWallet.ts:88](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/utils/keypairWallet.ts#L88)

Signs a message

#### Parameters

##### message

`Uint8Array`

The message to be signed

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Implementation of

[`BaseWallet`](../interfaces/BaseWallet.md).[`signMessage`](../interfaces/BaseWallet.md#signmessage)

***

### signTransaction()

> **signTransaction**\<`T`\>(`transaction`): `Promise`\<`T`\>

Defined in: [packages/core/src/utils/keypairWallet.ts:49](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/utils/keypairWallet.ts#L49)

Signs a single transaction

#### Type Parameters

##### T

`T` *extends* `VersionedTransaction` \| `Transaction`

Transaction type (Transaction or VersionedTransaction)

#### Parameters

##### transaction

`T`

The transaction to be signed

#### Returns

`Promise`\<`T`\>

Promise resolving to the signed transaction

#### Implementation of

[`BaseWallet`](../interfaces/BaseWallet.md).[`signTransaction`](../interfaces/BaseWallet.md#signtransaction)
