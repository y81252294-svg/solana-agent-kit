[**Documentation v2**](../../README.md)

***

[Documentation](../../README.md) / [solana-agent-kit](../README.md) / signOrSendTX

# Function: signOrSendTX()

> **signOrSendTX**(`agent`, `instructionsOrTransaction`, `otherKeypairs?`, `feeTier?`): `Promise`\<`string` \| `VersionedTransaction` \| `Transaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

Defined in: [packages/core/src/types/wallet.ts:82](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/types/wallet.ts#L82)

## Parameters

### agent

[`SolanaAgentKit`](../classes/SolanaAgentKit.md)

### instructionsOrTransaction

`TransactionInstruction`[] | `VersionedTransaction` | `Transaction` | `Transaction`[] | `VersionedTransaction`[]

### otherKeypairs?

`Keypair`[]

### feeTier?

`"min"` | `"mid"` | `"max"`

## Returns

`Promise`\<`string` \| `VersionedTransaction` \| `Transaction` \| `Transaction`[] \| `VersionedTransaction`[]\>
