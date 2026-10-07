[**Documentation v2**](../../README.md)

***

[Documentation](../../README.md) / [solana-agent-kit](../README.md) / sendTx

# Function: sendTx()

> **sendTx**(`agent`, `instructions`, `otherKeypairs?`, `feeTier?`): `Promise`\<`string`\>

Defined in: [packages/core/src/utils/send\_tx.ts:132](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/utils/send_tx.ts#L132)

Send a transaction with priority fees

## Parameters

### agent

[`SolanaAgentKit`](../classes/SolanaAgentKit.md)

SolanaAgentKit instance

### instructions

`TransactionInstruction`[]

### otherKeypairs?

`Keypair`[]

### feeTier?

`"min"` | `"mid"` | `"max"`

## Returns

`Promise`\<`string`\>

Transaction ID
