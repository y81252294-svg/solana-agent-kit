[**Documentation v2**](../../README.md)

***

[Documentation](../../README.md) / [solana-agent-kit](../README.md) / Action

# Interface: Action

Defined in: [packages/core/src/types/index.ts:102](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/types/index.ts#L102)

Main Action interface inspired by ELIZA
This interface makes it easier to implement actions across different frameworks

## Properties

### description

> **description**: `string`

Defined in: [packages/core/src/types/index.ts:116](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/types/index.ts#L116)

Detailed description of what the action does

***

### examples

> **examples**: [`ActionExample`](ActionExample.md)[][]

Defined in: [packages/core/src/types/index.ts:122](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/types/index.ts#L122)

Array of example inputs and outputs for the action
Each inner array represents a group of related examples

***

### handler

> **handler**: [`Handler`](../type-aliases/Handler.md)

Defined in: [packages/core/src/types/index.ts:132](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/types/index.ts#L132)

Function that executes the action

***

### name

> **name**: `string`

Defined in: [packages/core/src/types/index.ts:106](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/types/index.ts#L106)

Unique name of the action

***

### schema

> **schema**: `ZodType`\<`any`\>

Defined in: [packages/core/src/types/index.ts:127](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/types/index.ts#L127)

Zod schema for input validation

***

### similes

> **similes**: `string`[]

Defined in: [packages/core/src/types/index.ts:111](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/types/index.ts#L111)

Alternative names/phrases that can trigger this action
