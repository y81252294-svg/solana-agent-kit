[**Documentation v2**](../../README.md)

***

[Documentation](../../README.md) / [solana-agent-kit](../README.md) / SolanaAgentKit

# Class: SolanaAgentKit\<TPlugins\>

Defined in: [packages/core/src/agent/index.ts:43](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/agent/index.ts#L43)

Main class for interacting with Solana blockchain.

## Examples

```ts
// Define a plugin
const tokenPlugin = {
   name: "tokenPlugin",
   actions: [],
   methods: {
     transferToken: (to: string, amount: number) => {
       console.log(`Transferring ${amount} to ${to}`);
     },
   },
   initialize: (agent: any) => {},
};
```

```ts
// Create SolanaAgentKit instance
const agent = new SolanaAgentKit({
 signTransaction: async (tx) => {},
 signAllTransactions: async (txs) => {},
 sendTransaction: async (tx) => {},
 publicKey: "SomePublicKey",
}, "<rpcUrl>", {});
```

```ts
// Add plugin
const agentWithPlugins = agent.use(tokenPlugin);
```

```ts
// Use plugin method
agentWithPlugins.methods.transferToken("SomePublicKey", 100);
```

## Type Parameters

### TPlugins

`TPlugins` = `Record`\<`string`, `never`\>

## Constructors

### Constructor

> **new SolanaAgentKit**\<`TPlugins`\>(`wallet`, `rpc_url`, `config`): `SolanaAgentKit`\<`TPlugins`\>

Defined in: [packages/core/src/agent/index.ts:52](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/agent/index.ts#L52)

#### Parameters

##### wallet

[`BaseWallet`](../interfaces/BaseWallet.md)

##### rpc\_url

`string`

##### config

[`Config`](../interfaces/Config.md)

#### Returns

`SolanaAgentKit`\<`TPlugins`\>

## Properties

### actions

> **actions**: [`Action`](../interfaces/Action.md)[] = `[]`

Defined in: [packages/core/src/agent/index.ts:50](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/agent/index.ts#L50)

***

### config

> **config**: [`Config`](../interfaces/Config.md)

Defined in: [packages/core/src/agent/index.ts:45](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/agent/index.ts#L45)

***

### connection

> **connection**: `Connection`

Defined in: [packages/core/src/agent/index.ts:44](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/agent/index.ts#L44)

***

### methods

> **methods**: `TPlugins`

Defined in: [packages/core/src/agent/index.ts:49](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/agent/index.ts#L49)

***

### wallet

> **wallet**: [`BaseWallet`](../interfaces/BaseWallet.md)

Defined in: [packages/core/src/agent/index.ts:46](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/agent/index.ts#L46)

## Methods

### use()

> **use**\<`P`\>(`plugin`): `SolanaAgentKit`\<`TPlugins` & `PluginMethods`\<`P`\>\>

Defined in: [packages/core/src/agent/index.ts:61](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/core/src/agent/index.ts#L61)

Adds a plugin and registers its methods inside `methods`

#### Type Parameters

##### P

`P` *extends* [`Plugin`](../interfaces/Plugin.md)

#### Parameters

##### plugin

`P`

#### Returns

`SolanaAgentKit`\<`TPlugins` & `PluginMethods`\<`P`\>\>
