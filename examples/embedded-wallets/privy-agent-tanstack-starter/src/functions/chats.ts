import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
  deleteMessagesByChatIdAfterTimestamp,
  getChatById,
  getChatsByUserId,
  getMessageById,
  getMessagesByChatId,
  saveChat,
  saveMessages,
} from "db/queries";
import { useAppSession } from "../utils/session";
import type { DBMessage } from "db/schema";
import { generateUUID } from "../lib/utils";

export type PostType = {
  id: string;
  title: string;
  body: string;
};

export const fetchChat = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const chat = await getChatById({ id: data.id });
    const userId = (await useAppSession()).data.id;

    if (!chat) return undefined;

    if (chat.userId !== userId) {
      console.info(`Unauthorized access to chat with id ${data.id}`);
      throw notFound();
    }

    return chat;
  });

export const fetchMessages = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const messages = await getMessagesByChatId({ id: data.id });
    const userId = (await useAppSession()).data.id;

    if (!messages) {
      console.info(`Messages for chat with id ${data.id} not found`);
      throw notFound();
    }

    const chatUserId = (await getChatById({ id: data.id }))?.userId;
    if (chatUserId !== userId) {
      console.info(
        `Unauthorized access to messages for chat with id ${data.id}`,
      );
      throw notFound();
    }

    return messages as Array<{
      id: string;
      role: string;
      attachments: Array<{ url: string; name: string; contentType: string }>;
      parts: Array<{ type: string; text: string }>;
      createdAt: Date;
      chatId: string;
    }>;
  });

export const fetchChats = createServerFn({ method: "GET" })
  .validator(
    (data: {
      limit: number;
      startingAfter: string | null;
      endingBefore: string | null;
    }) => data,
  )
  .handler(async ({ data }) => {
    const userId = (await useAppSession()).data.id;

    if (!userId) {
      console.info("User not authenticated");
      throw notFound();
    }

    const chats = await getChatsByUserId({
      id: userId,
      limit: data.limit,
      endingBefore: data.endingBefore,
      startingAfter: data.startingAfter,
    });
    console.info("Fetching chats...");
    return chats;
  });

export const deleteTrailingMessages = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const [message] = await getMessageById({ id: data.id });

    await deleteMessagesByChatIdAfterTimestamp({
      chatId: message.chatId,
      timestamp: message.createdAt,
    });

    return { success: true };
  });

export const saveChatFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; title: string }) => data)
  .handler(async ({ data }) => {
    const userId = (await useAppSession()).data.id;
    if (!userId) {
      console.info("User not authenticated");
      throw notFound();
    }

    let chatId = data.id;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        const chat = await getChatById({ id: chatId });
        if (chat) {
          if (chat.userId === userId) {
            console.info(`Chat with id ${chatId} already exists and belongs to current user`);
            return chat;
          } else {
            // Generate a new UUID if the existing chat belongs to another user
            console.info(`Chat with id ${chatId} already exists but belongs to another user, generating new ID`);
            chatId = generateUUID();
            retryCount++;
            continue;
          }
        }

        const newChat = await saveChat({
          id: chatId,
          userId,
          title: data.title,
        });
        
        if (!newChat) {
          console.info(`Failed to create chat with id ${chatId}`);
          throw notFound();
        }

        return newChat;
      } catch (error) {
        if (error instanceof Error && 
            (error.message.includes('duplicate key value') || 
             error.message.includes('Chat_pkey'))) {
          // Generate a new UUID on primary key violation
          console.info(`Duplicate key error for chat ID ${chatId}, generating new ID`);
          chatId = generateUUID();
          retryCount++;
        } else {
          // Rethrow other errors
          throw error;
        }
      }
    }
    
    // If we've exhausted our retry attempts
    console.error(`Failed to create chat after ${maxRetries} attempts`);
    throw new Error(`Failed to create chat after ${maxRetries} attempts`);
  });

export const saveMessagesFn = createServerFn({ method: "POST" })
  .validator((data: { messages: Array<DBMessage> }) => data)
  .handler(async ({ data }) => {
    const userId = (await useAppSession()).data.id;
    if (!userId) {
      console.info("User not authenticated");
      throw notFound();
    }

    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        // Ensure each message has a unique ID by regenerating any that might conflict
        const messagesToSave = data.messages.map(message => ({
          ...message,
          id: message.id || generateUUID()
        }));
        
        const messages = await saveMessages({
          messages: messagesToSave,
        });
        
        if (!messages) {
          console.info(`Failed to save messages`);
          return "failed";
        }
        
        return "success";
      } catch (error) {
        if (error instanceof Error && 
            (error.message.includes('duplicate key value') || 
             error.message.includes('_pkey'))) {
          // If duplicate key error, regenerate all message IDs and retry
          data.messages = data.messages.map(msg => ({
            ...msg,
            id: generateUUID()
          }));
          retryCount++;
          console.info(`Duplicate key error for messages, regenerating IDs and retrying (${retryCount}/${maxRetries})`);
        } else {
          // Rethrow other errors
          console.error("Error saving messages:", error);
          return "failed";
        }
      }
    }
    
    console.error(`Failed to save messages after ${maxRetries} attempts`);
    return "failed";
  });
