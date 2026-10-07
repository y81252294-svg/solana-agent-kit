[**Documentation v2**](../../../README.md)

***

[Documentation](../../../README.md) / [@solana-agent-kit/adapter-mcp](../README.md) / startMcpServer

# Function: startMcpServer()

> **startMcpServer**(`actions`, `solanaAgentKit`, `options`): `Promise`\<`McpServer`\>

Defined in: [index.ts:169](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/adapter-mcp/src/index.ts#L169)

Helper to start the MCP server with stdio transport

## Parameters

### actions

`Record`\<`string`, `Action$1`\>

The actions to expose to the MCP server

### solanaAgentKit

`SolanaAgentKit`

The Solana agent kit

### options

The options for the MCP server

#### name

`string`

#### version

`string`

## Returns

`Promise`\<`McpServer`\>

The MCP server

## Throws

Error if the MCP server fails to start

## Example

```ts
import { ACTIONS } from "./actions";
import { startMcpServer } from "./mcpWrapper";

const solanaAgentKit = new SolanaAgentKit();

startMcpServer(ACTIONS, solanaAgentKit, {
  name: "solana-actions",
  version: "1.0.0"
});
```
