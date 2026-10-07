[**Documentation v2**](../../README.md)

***

[Documentation](../../README.md) / [solana-agent-kit](../README.md) / getComputeBudgetInstructions

# Function: getComputeBudgetInstructions()

> **getComputeBudgetInstructions**(`agent`, `instructions`, `feeTier`): `Promise`\<\{ `computeBudgetLimitInstruction`: `TransactionInstruction`; `computeBudgetPriorityFeeInstructions`: `TransactionInstruction`; \}\>

Defined in: [packages/core/src/utils/send\_tx.ts:25](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/utils/send_tx.ts#L25)

Get priority fees for the current block

## Parameters

### agent

[`SolanaAgentKit`](../classes/SolanaAgentKit.md)

### instructions

`TransactionInstruction`[]

### feeTier

`"min"` | `"mid"` | `"max"`

## Returns

`Promise`\<\{ `computeBudgetLimitInstruction`: `TransactionInstruction`; `computeBudgetPriorityFeeInstructions`: `TransactionInstruction`; \}\>

Priority fees statistics and instructions for different fee levels
