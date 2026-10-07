import { tool } from "@anthropic-ai/claude-agent-sdk";
import type { SolanaAgentKit } from "../agent";
import type { Action } from "../types/action";
import { executeAction } from "../utils/actionExecutor";
import { extractZodShape } from "./utils";

/**
 * Response content type for Claude Agents SDK tools
 * Index signature required by the SDK's type system
 */
interface ClaudeToolResponse {
  [key: string]: unknown;
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}

/**
 * Creates Claude Agents SDK compatible tools from SolanaAgentKit actions.
 *
 * @param solanaAgentKit - The initialized SolanaAgentKit instance
 * @param actions - Array of Action definitions to convert to tools
 * @returns Array of Claude SDK tool instances
 *
 * @example
 * ```typescript
 * import { SolanaAgentKit, createClaudeTools } from "solana-agent-kit";
 * import { createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
 * import TokenPlugin from "@solana-agent-kit/plugin-token";
 *
 * const agent = new SolanaAgentKit(wallet, rpcUrl, config)
 *   .use(TokenPlugin);
 *
 * const tools = createClaudeTools(agent, agent.actions);
 *
 * const server = createSdkMcpServer({
 *   name: "solana-tools",
 *   version: "1.0.0",
 *   tools
 * });
 * ```
 */
export function createClaudeTools(
  solanaAgentKit: SolanaAgentKit,
  actions: Action[],
) {
  if (actions.length > 128) {
    console.warn(
      `Too many actions provided. Only a maximum of 128 actions allowed. You provided ${actions.length}, the last ${actions.length - 128} will be ignored.`,
    );
  }

  const tools = [];

  for (const action of actions.slice(0, 127)) {
    // Build description matching vercel-ai pattern
    const description = `
      ${action.description}

      Similes: ${action.similes.map(
        (simile) => `
        ${simile}
      `,
      )}

      Examples: ${action.examples.map(
        (example) => `
        Input: ${JSON.stringify(example[0].input)}
        Output: ${JSON.stringify(example[0].output)}
        Explanation: ${example[0].explanation}
      `,
      )}
      `.trim();

    const schemaShape = extractZodShape(action.schema);

    tools.push(
      tool(
        action.name,
        description,
        schemaShape,
        async (args: Record<string, unknown>): Promise<ClaudeToolResponse> => {
          try {
            const result = await executeAction(action, solanaAgentKit, args);
            return {
              content: [
                { type: "text", text: JSON.stringify(result, null, 2) },
              ],
              isError: result.status === "error",
            };
          } catch (error: any) {
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      status: "error",
                      message: error.message,
                      code: error.code || "EXECUTION_ERROR",
                    },
                    null,
                    2,
                  ),
                },
              ],
              isError: true,
            };
          }
        },
      ),
    );
  }

  return tools;
}
