[**Documentation v2**](../../../README.md)

***

[Documentation](../../../README.md) / [@solana-agent-kit/adapter-mcp](../README.md) / zodToMCPShape

# Function: zodToMCPShape()

> **zodToMCPShape**(`schema`): `object`

Defined in: [index.ts:29](https://github.com/scriptscrypt/solana-agent-kit/blob/8d48a57968ef71c6851a44a8efa685e80e815610/packages/adapter-mcp/src/index.ts#L29)

Converts a Zod object schema to a flat shape for MCP tools

## Parameters

### schema

`ZodTypeAny`

The Zod schema to convert

## Returns

`object`

A flattened schema shape compatible with MCP tools

### keys

> **keys**: `string`[]

### result

> **result**: [`MCPSchemaShape`](../type-aliases/MCPSchemaShape.md)

## Throws

Error if the schema is not an object type
