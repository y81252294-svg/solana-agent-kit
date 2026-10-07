# Solana Agent Kit Examples

This directory contains a collection of examples demonstrating various implementations of the Solana Agent Kit. These examples are organized by category to help you find the right starting point for your project.

## Examples Overview

### DeFi Examples
- **[market-making-agent](defi/market-making-agent)** - Example of an agent for market making on Solana
- **[wormhole-nextjs-agent](defi/wormhole-nextjs-agent)** - Implementation of a cross-chain agent using Wormhole and Next.js
- **[okx-dex-starter](defi/okx-dex-starter)** - Starter template for building agents interacting with OKX DEX

### Embedded Wallets
- **[turnkey-agent-starter](embedded-wallets/turnkey-agent-starter)** - Agent implementation using Turnkey's embedded wallet solution
- **[privy-agent-tanstack-starter](embedded-wallets/privy-agent-tanstack-starter)** - Example using Privy wallet integration with TanStack
- **[crossmint-sak-v2](embedded-wallets/crossmint-sak-v2)** - Implementation using Crossmint's wallet infrastructure
- **[para-plugin-example](embedded-wallets/para-plugin-example)** - Example demonstrating Para wallet plugin integration

### MCP (Model Context Provider)
- **[agent-kit-mcp-server](mcp/agent-kit-mcp-server)** - Server implementation for Modular Conversation Prompting with Solana Agent Kit

### Miscellaneous
- **[persistent-agent](misc/persistent-agent)** - Example of an agent with persistent state
- **[agent-kit-nextjs-langchain](misc/agent-kit-nextjs-langchain)** - Integration of Agent Kit with Next.js and LangChain
- **[orbofi-personality-engine](misc/orbofi-personality-engine)** - Example using OrboFi personality engine
- **[agent-kit-langgraph](misc/agent-kit-langgraph)** - Integration with LangGraph for agent workflows
- **[privy-server-wallet-agent](misc/privy-server-wallet-agent)** - Example of a server wallet agent using Privy

### Social
- **[discord-bot-starter](social/discord-bot-starter)** - Starter template for building Discord bots with Agent Kit
- **[tg-bot-starter](social/tg-bot-starter)** - Template for Telegram bot integration

### n8n-solana-agent
A comprehensive [node setup](n8n-solana-agent) for integrating Solana Agent Kit with n8n workflow automation platform.

## Getting Started

Each example includes its own README with specific instructions. To get started:

1. Choose an example that best fits your use case
2. Navigate to the example directory
3. Follow the installation and setup instructions in the example's README

## Prerequisites

Most examples require:
- Node.js (version specified in each example)
- npm, yarn, or pnpm (as specified)
- Basic understanding of Solana and blockchain concepts

## Cloning

To clone an example, you can make use of gitpick, like so:

```bash
npx gitpick sendaifun/solana-agent-kit/examples/<example-category>/<example-name>
```

For example:

```bash
npx gitpick sendaifun/solana-agent-kit/examples/defi/market-making-agent
```

## Contributing

If you'd like to contribute a new example, please follow the standard contribution guidelines in the main repository.

## Support

For questions or issues with specific examples, please reference the individual example's documentation first. For general questions about the Solana Agent Kit, refer to the main documentation.
