import {
  type UIMessage,
  appendResponseMessages,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from "ai";
import { auth, type ExtendedSession } from "@/app/(auth)/auth";
import { systemPrompt } from "@/lib/ai/prompts";
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from "@/lib/db/queries";
import {
  generateUUID,
  getMostRecentUserMessage,
  getTrailingMessageId,
} from "@/lib/utils";
import { generateTitleFromUserMessage } from "../../actions";
import { isProductionEnvironment } from "@/lib/constants";
import { myProvider } from "@/lib/ai/providers";
import { SolanaAgentKit, createVercelAITools } from "solana-agent-kit";
import TokenPlugin from "@solana-agent-kit/plugin-token";
// Commented out due to the 30k token limit for OpenAI tier 1 accounts
// import MiscPlugin from "@solana-agent-kit/plugin-misc";
import { privyClient } from "@/lib/privy";
import { PublicKey } from "@solana/web3.js";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const {
      id,
      messages,
      selectedChatModel,
    }: {
      id: string;
      messages: Array<UIMessage>;
      selectedChatModel: string;
    } = await request.json();

    const session = (await auth()) as ExtendedSession;

    if (!session || !session.user || !session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const userMessage = getMostRecentUserMessage(messages);

    if (!userMessage) {
      return new Response("No user message found", { status: 400 });
    }

    const chat = await getChatById({ id });

    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message: userMessage,
      });

      await saveChat({ id, userId: session.user.id, title });
    } else {
      if (chat.userId !== session.user.id) {
        return new Response("Unauthorized", { status: 401 });
      }
    }

    const wallet = await privyClient.walletApi.getWallet({
      id: session.user.walletId,
    });
    const solanaAgent = new SolanaAgentKit(
      {
        publicKey: new PublicKey(wallet.address),
        sendTransaction: async () => {
          return "";
        },
        signMessage: async (message) => {
          return (
            await privyClient.walletApi.solana.signMessage({
              address: wallet.address,
              walletId: wallet.id,
              // @ts-expect-error - Privy chainType type mismatch
              chainType: "solana",
              message,
            })
          ).signature;
        },
        signAllTransactions: async (txs) => {
          const signedTxs = await Promise.all(
            txs.map(async (tx) => {
              const { signedTransaction } =
                await privyClient.walletApi.solana.signTransaction({
                  address: wallet.address,
                  walletId: wallet.id,
                  // @ts-expect-error - Privy chainType type mismatch
                  chainType: "solana",
                  transaction: tx,
                });

              return {
                ...tx,
                signatures: [signedTransaction],
              };
            })
          );

          return signedTxs;
        },
        // @ts-expect-error - Unnecessary type mismatch
        signTransaction: async (tx) => {
          const { signedTransaction } =
            await privyClient.walletApi.solana.signTransaction({
              address: wallet.address,
              walletId: wallet.id,
              // @ts-expect-error - Privy chainType type mismatch
              chainType: "solana",
              transaction: tx,
            });

          return signedTransaction;
        },
        signAndSendTransaction: async (tx) => {
          const { hash } =
            await privyClient.walletApi.solana.signAndSendTransaction({
              address: wallet.address,
              caip2: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
              // @ts-expect-error - Privy chainType type mismatch
              chainType: "solana",
              walletId: wallet.id,
              transaction: tx,
            });

          return { signature: hash };
        },
      },
      process.env.RPC_URL,
      {}
    ).use(TokenPlugin);
    // Commented out due to the 30k token limit for OpenAI tier 1 accounts
    // .use(MiscPlugin);

    const vercelAITools = createVercelAITools(solanaAgent, solanaAgent.actions);

    await saveMessages({
      messages: [
        {
          chatId: id,
          id: userMessage.id,
          role: "user",
          parts: userMessage.parts,
          attachments: userMessage.experimental_attachments ?? [],
          createdAt: new Date(),
        },
      ],
    });

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: myProvider.languageModel(selectedChatModel),
          system: systemPrompt,
          messages,
          maxSteps: 5,
          experimental_transform: smoothStream({ chunking: "word" }),
          experimental_generateMessageId: generateUUID,
          tools: vercelAITools,
          onFinish: async ({ response }) => {
            if (session.user?.id) {
              try {
                const assistantId = getTrailingMessageId({
                  messages: response.messages.filter(
                    (message) => message.role === "assistant"
                  ),
                });

                if (!assistantId) {
                  throw new Error("No assistant message found!");
                }

                const [, assistantMessage] = appendResponseMessages({
                  messages: [userMessage],
                  responseMessages: response.messages,
                });

                await saveMessages({
                  messages: [
                    {
                      id: assistantId,
                      chatId: id,
                      role: assistantMessage.role,
                      parts: assistantMessage.parts,
                      attachments:
                        assistantMessage.experimental_attachments ?? [],
                      createdAt: new Date(),
                    },
                  ],
                });
              } catch (_) {
                console.error("Failed to save chat");
              }
            }
          },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: "stream-text",
          },
        });

        result.consumeStream();

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: (e) => {
        // @ts-expect-error - error type mismatch
        console.error(e.message);
        return "Oops, an error occurred!";
      },
    });
  } catch (error) {
    return new Response("An error occurred while processing your request!", {
      status: 404,
    });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await deleteChatById({ id });

    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    return new Response("An error occurred while processing your request!", {
      status: 500,
    });
  }
}
