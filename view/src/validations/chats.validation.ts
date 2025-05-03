import { z } from "zod";

export const chatSchema = z.object({
    _id: z.string(),
    chatId: z.string(),
    phoneNumber: z.string(),
    name: z.string(),
    lastMessage: z.string(),
    lastMessageType: z.string(),
    lastMessageTime: z.string()
});

export const chatsResponseSchema = z.object({
    status: z.string(),
    totalChats: z.number(),
    chats: z.array(chatSchema)
});

export type ChatItem = z.infer<typeof chatSchema>;
