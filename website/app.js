// ==========================================================================
// SOLANA AGENT KIT - INTERACTIVE PLAYGROUND LOGIC
// Designed & Developed by Shourya Goyal
// ==========================================================================

const SIMULATIONS = {
  swap: [
    { text: "> User: 'Swap 0.5 SOL to USDC with minimum 0.5% slippage'", type: "prompt" },
    { text: "⚡ [Agent Kernel] LLM reasoned: Intent is token swap on Solana", type: "agent" },
    { text: "🔍 [Jupiter Routing] Fetching best route quote for 0.5 SOL -> USDC...", type: "dim" },
    { text: "   Route found: SOL -> Raydium CLMM -> USDC (Est: 78.42 USDC)", type: "dim" },
    { text: "✍️ [Wallet] Signing VersionedTransaction with agent keypair...", type: "agent" },
    { text: "📡 [Solana RPC] Broadcasting transaction to Mainnet-Beta...", type: "dim" },
    { text: "✅ [Success] Swap confirmed in 382ms! Block: 301,842,910", type: "success" },
    { text: "🔗 Signature: 5UxZ7r9kQvP1...M2jKn4Ws9eLtPx7", type: "sig" }
  ],
  airdrop: [
    { text: "> User: 'Send 10 $AGENT tokens to 1,000 community recipients'", type: "prompt" },
    { text: "⚡ [Agent Kernel] Initializing Light Protocol ZK-Compression tool...", type: "agent" },
    { text: "📦 [State Compression] Generating State Trees & Merkle proofs...", type: "dim" },
    { text: "💰 [Cost Optimization] Standard Airdrop: ~2.4 SOL -> Compressed: ~0.0035 SOL (99.8% savings)", type: "success" },
    { text: "✍️ [Wallet] Signing batch compressed transfer...", type: "agent" },
    { text: "✅ [Success] 1,000 addresses credited with 10 $AGENT tokens!", type: "success" },
    { text: "🔗 Signature: 3LkR1x9uVwP...Z4qNm8Lt3eTxPn9", type: "sig" }
  ],
  nft: [
    { text: "> User: 'Mint a Metaplex Core NFT titled CyberAgent #001'", type: "prompt" },
    { text: "⚡ [Agent Kernel] Preparing Metaplex Core asset schema...", type: "agent" },
    { text: "📁 [IPFS/Arweave] Uploading asset metadata JSON...", type: "dim" },
    { text: "   URI: https://arweave.net/tx_9xLkQ1...8wPzN", type: "dim" },
    { text: "✍️ [Wallet] Calling Metaplex Core `createV1` instruction...", type: "agent" },
    { text: "✅ [Success] Core NFT minted to agent wallet!", type: "success" },
    { text: "   Asset ID: 7xK3mPvLqR1w...Y9tNm4Ws2eLt", type: "sig" }
  ],
  launch: [
    { text: "> User: 'Launch a new meme token $SOLBOT on PumpPortal with 1 SOL liquidity'", type: "prompt" },
    { text: "⚡ [Agent Kernel] Constructing token parameters: name, symbol, decimals (6)", type: "agent" },
    { text: "🚀 [PumpPortal SDK] Deploying bonding curve pool...", type: "dim" },
    { text: "✍️ [Wallet] Executing initial bundle with Jito MEV protection...", type: "agent" },
    { text: "✅ [Success] $SOLBOT token live on Solana bonding curve!", type: "success" },
    { text: "   Mint Address: B2jKn4Ws9eLt...5UxZ7r9kQvP1", type: "sig" }
  ],
  stake: [
    { text: "> User: 'Stake 2.0 SOL to highest yield decentralised validator'", type: "prompt" },
    { text: "⚡ [Agent Kernel] Querying Solana validator cluster performance...", type: "agent" },
    { text: "📊 Selected validator: EdgeValidator (0% commission, 7.42% APY)", type: "dim" },
    { text: "✍️ [Wallet] Creating Stake Account & Delegating 2.0 SOL...", type: "agent" },
    { text: "✅ [Success] Stake account active, activation in next epoch!", type: "success" },
    { text: "   Stake Pubkey: 9wPzN4Ws2eLt...7xK3mPvLqR1w", type: "sig" }
  ]
};

let currentAction = 'swap';
let isRunning = false;

function renderSimulation(actionKey) {
  const terminal = document.getElementById('terminal-output');
  if (!terminal) return;

  terminal.innerHTML = '';
  const lines = SIMULATIONS[actionKey] || SIMULATIONS.swap;
  isRunning = true;

  lines.forEach((line, index) => {
    setTimeout(() => {
      const lineDiv = document.createElement('div');
      lineDiv.className = `term-line term-${line.type}`;
      lineDiv.textContent = line.text;
      terminal.appendChild(lineDiv);
      terminal.scrollTop = terminal.scrollHeight;

      if (index === lines.length - 1) {
        isRunning = false;
      }
    }, index * 240);
  });
}

// Action button handlers
document.querySelectorAll('.action-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (isRunning) return;
    document.querySelectorAll('.action-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentAction = btn.getAttribute('data-action');
    renderSimulation(currentAction);
  });
});

// Re-run terminal button
const runAgainBtn = document.getElementById('terminal-run-again');
if (runAgainBtn) {
  runAgainBtn.addEventListener('click', () => {
    if (!isRunning) {
      renderSimulation(currentAction);
    }
  });
}

// Install command tab switcher
const packageCommands = {
  pnpm: 'pnpm add solana-agent-kit @solana/web3.js',
  npm: 'npm install solana-agent-kit @solana/web3.js',
  yarn: 'yarn add solana-agent-kit @solana/web3.js'
};

document.querySelectorAll('.code-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const pkg = tab.getAttribute('data-tab');
    const cmdEl = document.getElementById('install-command');
    if (cmdEl && packageCommands[pkg]) {
      cmdEl.textContent = packageCommands[pkg];
    }
  });
});

// Copy install command
const copyInstallBtn = document.getElementById('copy-install-btn');
if (copyInstallBtn) {
  copyInstallBtn.addEventListener('click', () => {
    const cmd = document.getElementById('install-command')?.textContent;
    if (cmd) {
      navigator.clipboard.writeText(cmd);
      copyInstallBtn.textContent = 'Copied!';
      setTimeout(() => { copyInstallBtn.textContent = 'Copy'; }, 1800);
    }
  });
}

// Copy code snippet
const copySnippetBtn = document.getElementById('copy-snippet-btn');
if (copySnippetBtn) {
  copySnippetBtn.addEventListener('click', () => {
    const code = `import { SolanaAgentKit, createSolanaTools } from "solana-agent-kit";

const agent = new SolanaAgentKit(
  process.env.SOLANA_PRIVATE_KEY!,
  "https://api.mainnet-beta.solana.com",
  process.env.OPENAI_API_KEY!
);

const tools = createSolanaTools(agent);
console.log("Agent initialized with", tools.length, "Solana actions.");`;
    navigator.clipboard.writeText(code);
    copySnippetBtn.textContent = 'Copied!';
    setTimeout(() => { copySnippetBtn.textContent = 'Copy Code'; }, 1800);
  });
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
  renderSimulation('swap');
});
