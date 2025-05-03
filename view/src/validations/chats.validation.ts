import { z } from "zod";

export const chatSchema = z.object({
    chatId: z.string(),
    createdAt: z.string(),
    name: z.string(),
    phoneNumber: z.string(),
    updatedAt: z.string(),
    __v: z.number(),
    _id: z.string()
});

export const chatsResponseSchema = z.object({
    status: z.string(),
    chats: z.array(chatSchema),
    currentPage: z.number(),
    totalChats: z.number(),
    totalPages: z.number()
});

export type ChatItem = z.infer<typeof chatSchema>;
