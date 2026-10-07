[**Documentation v2**](../../../README.md)

***

[Documentation](../../../README.md) / [@solana-agent-kit/plugin-blinks](../README.md) / default

# Variable: default

> `const` **default**: `object`

Defined in: [index.ts:6](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/plugin-blinks/src/index.ts#L6)

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

#### methods.rock\_paper\_scissor()

> **methods.rock\_paper\_scissor**: (`agent`, `amount`, `choice`) => `Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

##### Parameters

###### agent

`SolanaAgentKit`

###### amount

`number`

###### choice

`"rock"` | `"paper"` | `"scissors"`

##### Returns

`Promise`\<`string` \| `Transaction` \| `VersionedTransaction` \| `Transaction`[] \| `VersionedTransaction`[]\>

### name

> **name**: `string` = `"blinks"`
