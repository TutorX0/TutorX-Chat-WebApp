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

export const replySchema = z.object({
    sender: z.string(),
    content: z.string().optional().nullable(),
    mediaType: z.string()
});

export type Reply = z.infer<typeof replySchema>;

/**
 * ✅ ChatMessage schema updated with `status` field
 */
export const chatMessage = z.object({
    _id: z.string(),
    sender: z.string(),
    content: z.string().optional(),
    type: z.string(),
    mediaUrl: z.string().nullable(),
    fileName: z.string().nullable(),
    createdAt: z.string(),
    isForwarded: z.boolean(),
    replyTo: replySchema.nullable(),

    // 👇 Added this for tick system
    status: z.enum(["sent", "delivered", "read"]).optional()
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

/**
 * ✅ SocketData schema updated with `status` field
 * so real-time events also carry ticks info
 */
export const socketData = z.object({
    messageId: z.string(),
    chatId: z.string(),
    chatName: z.string(),
    chat_id: z.string(),
    content: z.string(),
    fileName: z.string().nullable(),
    mediaUrl: z.string().nullable(),
    messageType: z.string(),
    phoneNumber: z.string(),
    sender: z.string(),
    timestamp: z.string(),
    isForwarded: z.boolean(),
    replyTo: replySchema.nullable(),

    // 👇 Added this
    status: z.enum(["sent", "delivered", "read"]).optional()
});

export type SocketData = z.infer<typeof socketData>;
