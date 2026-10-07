[**Documentation v2**](../../README.md)

***

[Documentation](../../README.md) / [solana-agent-kit](../README.md) / BaseWallet

# Interface: BaseWallet

Defined in: [packages/core/src/types/wallet.ts:27](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/types/wallet.ts#L27)

Interface representing a Solana wallet implementation

Defines the standard interface for interacting with a Solana wallet,
including transaction signing, message signing, and connection status.

 Wallet

## Properties

### publicKey

> `readonly` **publicKey**: `PublicKey`

Defined in: [packages/core/src/types/wallet.ts:32](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/types/wallet.ts#L32)

The public key of the connected wallet

***

### sendTransaction()?

> `optional` **sendTransaction**: \<`T`\>(`transaction`) => `Promise`\<`string`\>

Defined in: [packages/core/src/types/wallet.ts:59](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/types/wallet.ts#L59)

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

***

### signAndSendTransaction()

> **signAndSendTransaction**: \<`T`\>(`transaction`, `options?`) => `Promise`\<\{ `signature`: `string`; \}\>

Defined in: [packages/core/src/types/wallet.ts:70](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/types/wallet.ts#L70)

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

## Methods

### signAllTransactions()

> **signAllTransactions**\<`T`\>(`transactions`): `Promise`\<`T`[]\>

Defined in: [packages/core/src/types/wallet.ts:50](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/types/wallet.ts#L50)

Signs multiple transactions in batch

#### Type Parameters

##### T

`T` *extends* `VersionedTransaction` \| `Transaction`

Transaction type (Transaction or VersionedTransaction)

#### Parameters

##### transactions

`T`[]

Array of transactions to be signed

#### Returns

`Promise`\<`T`[]\>

Promise resolving to an array of signed transactions

***

### signMessage()

> **signMessage**(`message`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [packages/core/src/types/wallet.ts:79](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/types/wallet.ts#L79)

Signs a message

#### Parameters

##### message

`Uint8Array`

The message to be signed

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### signTransaction()

> **signTransaction**\<`T`\>(`transaction`): `Promise`\<`T`\>

Defined in: [packages/core/src/types/wallet.ts:40](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/types/wallet.ts#L40)

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
