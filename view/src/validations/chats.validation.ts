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

export const addChatResponseSchema = z.object({
    status: z.string(),
    message: z.string(),
    chat: z.object({
        chatId: z.string(),
        createdAt: z.string(),
        name: z.string(),
        phoneNumber: z.string(),
        updatedAt: z.string(),
        __v: z.number(),
        _id: z.string()
    })
});
