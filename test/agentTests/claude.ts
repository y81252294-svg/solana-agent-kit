import Anthropic from "@anthropic-ai/sdk";
import type { SolanaAgentKit } from "solana-agent-kit";
import { zodToJsonSchema } from "zod-to-json-schema";
import { question } from "../utils";

export default async function (agent: SolanaAgentKit) {
  const actions = agent.actions;

  if (actions.length > 128) {
    console.warn(
      `Too many actions provided. Only a maximum of 128 actions allowed. You provided ${actions.length}, the last ${actions.length - 128} will be ignored.`,
    );
  }

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY as string,
  });

  const messages: Anthropic.MessageParam[] = [];

  const systemPrompt = `You are a helpful agent that can interact onchain using the Solana Agent Kit. You are empowered to interact onchain using your tools. If you ever need funds, you can request them from the faucet. If not, you can provide your wallet details and request funds from the user. If there is a 5XX (internal) HTTP error code, ask the user to try again later. If someone asks you to do something you can't do with your currently available tools, you must say so, and encourage them to implement it themselves using the Solana Agent Kit, recommend they go to https://www.solanaagentkit.xyz for more information. Be concise and helpful with your responses. Refrain from restating your tools' descriptions unless it is explicitly requested.`;

  // Convert actions to Anthropic tool format
  const anthropicTools: Anthropic.Tool[] = actions
    .slice(0, 128)
    .map((action) => {
      const jsonSchema = zodToJsonSchema(action.schema, {
        $refStrategy: "none",
      });

      // Build enhanced description with similes and examples (matching other adapters)
      const description = `
      ${action.description}

      Similes: ${action.similes.map((simile) => `${simile}`).join(", ")}

      Examples: ${action.examples
        .map(
          (example) => `
        Input: ${JSON.stringify(example[0].input)}
        Output: ${JSON.stringify(example[0].output)}
        Explanation: ${example[0].explanation}
      `,
        )
        .join("")}
      `.trim();

      return {
        name: action.name,
        description,
        input_schema: jsonSchema as Anthropic.Tool.InputSchema,
      };
    });

  // Create a map for quick action lookup
  const actionMap = new Map(actions.map((action) => [action.name, action]));

  try {
    while (true) {
      const prompt = await question("\nYou: ");

      if (prompt === "exit") {
        break;
      }

      messages.push({
        role: "user",
        content: prompt,
      });

      let response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: systemPrompt,
        tools: anthropicTools,
        messages,
      });

      // Handle tool use loop
      while (response.stop_reason === "tool_use") {
        const toolUseBlocks = response.content.filter(
          (block: Anthropic.ContentBlock): block is Anthropic.ToolUseBlock =>
            block.type === "tool_use",
        );

        const toolResults: Anthropic.ToolResultBlockParam[] = [];

        for (const toolUse of toolUseBlocks) {
          const action = actionMap.get(toolUse.name);
          if (action) {
            try {
              // Validate input and execute action
              const validatedInput = action.schema.parse(toolUse.input);
              const result = await action.handler(agent, validatedInput);

              toolResults.push({
                type: "tool_result",
                tool_use_id: toolUse.id,
                content: JSON.stringify(
                  { status: "success", ...result },
                  null,
                  2,
                ),
              });
            } catch (error: any) {
              // Handle Zod validation errors specially
              if (error.errors) {
                toolResults.push({
                  type: "tool_result",
                  tool_use_id: toolUse.id,
                  content: JSON.stringify({
                    status: "error",
                    message: "Validation error",
                    details: error.errors,
                    code: "VALIDATION_ERROR",
                  }),
                  is_error: true,
                });
              } else {
                toolResults.push({
                  type: "tool_result",
                  tool_use_id: toolUse.id,
                  content: JSON.stringify({
                    status: "error",
                    message: error.message,
                    code: error.code || "EXECUTION_ERROR",
                  }),
                  is_error: true,
                });
              }
            }
          }
        }

        // Add assistant message and tool results
        messages.push({
          role: "assistant",
          content: response.content,
        });

        messages.push({
          role: "user",
          content: toolResults,
        });

        // Continue the conversation
        response = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system: systemPrompt,
          tools: anthropicTools,
          messages,
        });
      }

      // Extract text response
      const textBlocks = response.content.filter(
        (block: Anthropic.ContentBlock): block is Anthropic.TextBlock =>
          block.type === "text",
      );

      const assistantMessage = textBlocks
        .map((b: Anthropic.TextBlock) => b.text)
        .join("\n");
      console.log("Agent:", assistantMessage);

      messages.push({
        role: "assistant",
        content: response.content,
      });
    }
  } catch (e) {
    if (e instanceof Error) {
      console.error("Error:", e.message);
    }
    process.exit(1);
  }
}
