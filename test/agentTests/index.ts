import type { SolanaAgentKit } from "solana-agent-kit";
import { chooseAgent } from "../utils";
import claudeAITests from "./claude";
import langchainAITests from "./langchain";
import openAITests from "./openai";
import vercelAITests from "./vercel-ai";

export default async function aiTests(agentKit: SolanaAgentKit) {
  const agent = await chooseAgent([
    "vercel-ai",
    "langchain",
    "openai",
    "claude",
  ] as const);

  switch (agent) {
    case "vercel-ai":
      await vercelAITests(agentKit);
      break;
    case "langchain":
      await langchainAITests(agentKit);
      break;
    case "openai":
      await openAITests(agentKit);
      break;
    case "claude":
      await claudeAITests(agentKit);
      break;
  }
}
