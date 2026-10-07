import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  appendResponseMessages,
  type CoreAssistantMessage,
  type CoreToolMessage,
  generateText,
  type Message,
} from "ai";
import { myProvider } from "~/lib/ai/providers";
import type { UseChatHelpers } from "@ai-sdk/react";
import { useWallet } from "@crossmint/client-sdk-react-ui";
import { SolanaAgentKit, createVercelAITools } from "solana-agent-kit";
import TokenPlugin from "@solana-agent-kit/plugin-token";
import {
  Connection,
  PublicKey,
  Transaction,
  VersionedTransaction,
  TransactionMessage,
} from "@solana/web3.js";
import { generateUUID } from "~/lib/utils";
import { fetchChat, saveChatFn, saveMessagesFn } from "~/functions/chats";
import { fetchSession } from "~/functions/session";

type ResponseMessageWithoutId = CoreToolMessage | CoreAssistantMessage;
type ResponseMessage = ResponseMessageWithoutId & { id: string };

export function getTrailingMessageId({
  messages,
}: {
  messages: Array<ResponseMessage>;
}): string | null {
  const trailingMessage = messages.at(-1);

  if (!trailingMessage) return null;

  return trailingMessage.id;
}

interface UseChatOptions {
  id: string;
  initialMessages?: Message[];
  selectedChatModel?: string;
}
type Status = "submitted" | "streaming" | "ready" | "error";
type Reload = UseChatHelpers["reload"];
type Stop = UseChatHelpers["stop"];

export async function generateTitleFromUserMessage({
  message,
}: {
  message: Message;
}) {
  const { text: title } = await generateText({
    model: myProvider.languageModel("title-model"),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  });

  return title;
}

export function useChat({ id, initialMessages = [] }: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState<string>("");
  const [status, setStatus] = useState<Status>("ready");
  const { wallet, status: walletStatus } = useWallet();

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const solanaTools = useMemo(() => {
    if (wallet) {
      const walletAddress =
        (wallet as any).address || (wallet as any).publicKey?.toString();
      if (!walletAddress) return;

      const agent = new SolanaAgentKit(
        {
          publicKey: new PublicKey(walletAddress),
          signTransaction: async (tx) => {
            return tx;
          },
          signMessage: async (msg) => {
            const signed = await (wallet as any).signMessage(msg);
            return signed;
          },
          sendTransaction: async (tx) => {
            const serializedTx =
              tx instanceof Transaction
                ? tx.serialize().toString("hex")
                : Buffer.from(tx.serialize()).toString("hex");

            return await (wallet as any).sendTransaction({
              ...tx,
              to: import.meta.env.VITE_RPC_URL, // Using RPC URL as the 'to' address
              value: "0", // Required by Crossmint but not used for Solana
              data: serializedTx,
            });
          },
          signAllTransactions: async (txs) => {
            return txs;
          },
          signAndSendTransaction: async (tx) => {
            const connection = new Connection(
              import.meta.env.VITE_RPC_URL as string,
              "confirmed",
            );

            if (tx instanceof Transaction) {
              const message = tx.compileMessage();
              const versionedTx = new VersionedTransaction(message);
              const sig = await wallet.sendTransaction({
                transaction: versionedTx,
                to: import.meta.env.VITE_RPC_URL,
              });
              return { signature: sig };
            } else {
              const sig = await wallet.sendTransaction({
                transaction: tx,
                to: import.meta.env.VITE_RPC_URL,
              });
              return { signature: sig };
            }
          },
        },
        import.meta.env.VITE_RPC_URL as string,
        {
          signOnly: false,
        },
      ).use(TokenPlugin);

      const tools = createVercelAITools(agent, agent.actions);
      return tools;
    }
  }, [wallet]);

  const append = useCallback(
    (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      return newMessage.content;
    },
    [setMessages],
  );

  const reload: Reload = async (chatOptions) => {
    return null;
  };

  const stop: Stop = async () => {
    setStatus("ready");
    setIsLoading(false);
  };

  const sendMessage = useCallback(
    async (newMessage?: Message) => {
      setStatus("submitted");
      const session = await fetchSession();

      if (!session?.id) {
        setError("You must be logged in to send messages");
        return;
      }

      setIsLoading(true);
      setError(null);

      // Update UI immediately with the new message
      if (newMessage) {
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
      }

      const lastMessage = newMessage ?? (messages.at(-1) as Message);

      try {
        // Check if chat exists
        const chat = await fetchChat({ data: { id: id } });

        if (!chat) {
          const title = await generateTitleFromUserMessage({
            message: lastMessage,
          });
          await saveChatFn({
            data: {
              id,
              title,
            },
          });
        } else if (chat.userId !== session.id) {
          throw new Error("Unauthorized");
        }

        if (newMessage) {
          // Save the user message
          await saveMessagesFn({
            data: {
              messages: [
                {
                  chatId: id,
                  id: lastMessage.id,
                  role: lastMessage.role,
                  parts: lastMessage.parts,
                  attachments: lastMessage.experimental_attachments ?? [],
                  createdAt: new Date(),
                },
              ],
            },
          });
        }

        // Generate response
        if (session.id) {
          if (!wallet) {
            setError("Crossmint wallet not connected");
            return;
          }

          const res = await generateText({
            model: myProvider.languageModel("chat-model"),
            system:
              "You're a helpful Solana assistant that helps people carry out transactions and actions on the Solana blockchain. You can only perform actions and answer questions related to Solana.",
            messages: newMessage ? [...messages, newMessage] : messages,
            maxSteps: 5,
            experimental_generateMessageId: generateUUID,
            tools: solanaTools,
          });

          try {
            const assistantId = getTrailingMessageId({
              messages: res.response.messages.filter(
                (message) => message.role === "assistant",
              ),
            });

            if (!assistantId) {
              throw new Error("No assistant message found!");
            }

            const [, assistantMessage] = appendResponseMessages({
              messages: [lastMessage],
              responseMessages: res.response.messages,
            });

            const saveRes = await saveMessagesFn({
              data: {
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
              },
            });

            if (saveRes === "failed") {
              throw new Error("Failed to save chat");
            }

            if (newMessage) {
              setMessages([
                ...[...messages, lastMessage],
                {
                  content: assistantMessage.content,
                  id: assistantMessage.id,
                  parts: assistantMessage.parts,
                  role: "assistant",
                },
              ]);
            } else {
              setMessages([
                ...messages,
                {
                  content: assistantMessage.content,
                  id: assistantMessage.id,
                  parts: assistantMessage.parts,
                  role: "assistant",
                },
              ]);
            }

            setStatus("ready");
          } catch (e) {
            console.error("Failed to save chat");
            setStatus("error");
          }
        }
      } catch (err) {
        setStatus("error");
        console.error("Error in chat:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while processing your request",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [id, messages, solanaTools],
  );

  useLayoutEffect(() => {
    (async () => {
      const lastMessage = messages.at(-1);
      if (lastMessage?.role === "user") {
        await sendMessage();
      }
    })();
  }, [initialMessages]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      const messageContent = input;
      if (!messageContent) {
        setError("Message cannot be empty");
        return;
      }
      const newMessage: Message = {
        id: generateUUID(),
        content: messageContent,
        role: "user",
        parts: [{ type: "text", text: messageContent }],
      };
      sendMessage(newMessage);
      e?.currentTarget.reset();
    },
    [sendMessage, input],
  );

  const deleteChat = useCallback(async () => {
    const session = await fetchSession();
    if (!session?.id) {
      setError("You must be logged in to delete chats");
      return;
    }

    try {
      const chat = await fetchChat({ data: { id } });

      if (chat?.userId !== session.id) {
        throw new Error("Unauthorized");
      }

      await fetch(`/api/chat?id=${id}`, { method: "DELETE" });
      return true;
    } catch (err) {
      console.error("Error deleting chat:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while deleting the chat",
      );
      return false;
    }
  }, [id]);

  return {
    messages,
    isLoading,
    error,
    setMessages,
    sendMessage,
    deleteChat,
    append,
    handleSubmit,
    reload,
    stop,
    input,
    setInput,
    status,
  };
}
