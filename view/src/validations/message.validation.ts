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
    _id: z.string(),
    sender: z.string(),
    content: z.string().optional(),
    type: z.string(),
    mediaUrl: z.string().nullable(),
    fileName: z.string().nullable(),
    createdAt: z.string(),
    isForwarded: z.boolean(),
    replyTo: z.string()
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

export const socketData = z.object({
    chatId: z.string(),
    content: z.string(),
    fileName: z.string().nullable(),
    mediaUrl: z.string().nullable(),
    messageType: z.string(),
    phoneNumber: z.string(),
    sender: z.string(),
    timestamp: z.string(),
    isForwarded: z.boolean(),
    replyTo: z.string()
});

export type SocketData = z.infer<typeof socketData>;
