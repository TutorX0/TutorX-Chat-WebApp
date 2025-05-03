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
    content: z.string(),
    createdAt: z.string(),
    sender: z.string(),
    _id: z.string()
});

export type ChatMessage = z.infer<typeof chatMessage>;

export const groupedMessages = z.record(z.array(chatMessage));

export type GroupedMessages = z.infer<typeof groupedMessages>;

export const fetchMessageResponseSchema = z.object({
    status: z.string(),
    chat: z.object({
        chatId: z.string(),
        groupedMessages: groupedMessages,
        name: z.string(),
        phoneNumber: z.string()
    })
});
