import { z } from "zod";

const textMessageDataResponseSchema = z.object({
    messaging_product: z.string(),
    messages: z.array(z.object({ id: z.string() })),
    contacts: z.array(z.object({ input: z.string(), wa_id: z.string() }))
});

export const textMessageResponseSchema = z.object({
    chatId: z.string(),
    status: z.string(),
    data: textMessageDataResponseSchema
});

export type TextMessage = z.infer<typeof textMessageResponseSchema>;

export const chatMessage = z.object({
    chatId: z.string(),
    content: z.string(),
    createdAt: z.string(),
    mediaUrl: z.string().nullable().optional(),
    messageType: z.string(),
    phoneNumber: z.string(),
    sender: z.string(),
    updatedAt: z.string(),
    __v: z.number(),
    _id: z.string()
});

export type ChatMessage = z.infer<typeof chatMessage>;

export const fetchMessageResponseSchema = z.object({
    totalPages: z.number(),
    totalMessages: z.number(),
    currentPage: z.number(),
    status: z.string(),
    chat: z.object({
        chatId: z.string(),
        messages: z.array(chatMessage),
        name: z.string(),
        phoneNumber: z.string()
    })
});
