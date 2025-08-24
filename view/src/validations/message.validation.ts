import { z } from "zod";

// reply schema
export const replySchema = z.object({
    _id: z.string(),
    sender: z.string(),
    content: z.string().optional(),
    type: z.string(),
    mediaUrl: z.string().nullable(),
    fileName: z.string().nullable(),
    createdAt: z.string()
});

// core chat message schema
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
    status: z.enum(["pending", "sent", "delivered", "read", "failed"]).default("pending") // ✅ added
});

export type ChatMessage = z.infer<typeof chatMessage>;

// grouped messages
export const groupedMessages = z.record(z.string(), z.array(chatMessage));
export type GroupedMessages = z.infer<typeof groupedMessages>;

// socket data (for realtime messages)
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
    status: z.enum(["pending", "sent", "delivered", "read", "failed"]).default("pending") // ✅ added
});
export type SocketData = z.infer<typeof socketData>;

// fetch messages schema
export const fetchMessageResponseSchema = z.object({
    message: z.string().optional(), // optional message,
    chat: z.object({
        groupedMessages: groupedMessages
    })
});
