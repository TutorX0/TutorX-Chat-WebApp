import { z } from "zod";

// 🔹 Reply schema
export const replySchema = z.object({
  _id: z.string(),
  sender: z.string(),
  content: z.string().optional(),
  type: z.string().optional(),        // 👈 was required
  mediaUrl: z.string().nullable().optional(), // 👈 safer
  fileName: z.string().nullable().optional(),
  createdAt: z.string().optional()    // 👈 was required
});

// 🔹 Export Reply type
export type Reply = z.infer<typeof replySchema>;

// 🔹 Core chat message schema
export const chatMessage = z.object({
  _id: z.string(),
  sender: z.string(),
  content: z.string().optional(),
  whatsappMessageId: z.string().optional(),
  type: z.string(),
  mediaUrl: z.string().nullable(),
  fileName: z.string().nullable(),
  createdAt: z.string(),
  isForwarded: z.boolean(),
  replyTo: replySchema.nullable(),
  status: z.enum(["pending", "sent", "delivered", "read", "failed"]).default("pending"),
  read: z.boolean().default(false)
});

// 🔹 ChatMessage Type
export type ChatMessage = z.infer<typeof chatMessage>;

// 🔹 Grouped messages schema
export const groupedMessages = z.record(z.string(), z.array(chatMessage));
export type GroupedMessages = z.infer<typeof groupedMessages>;

// 🔹 Socket data schema (for realtime messages)
export const socketData = z.object({
  messageId: z.string(),
  chatId: z.string(),
  chatName: z.string(),
    whatsappMessageId: z.string().optional(),
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
  status: z.enum(["pending", "sent", "delivered", "read", "failed"]).default("pending"),
   read: z.boolean().default(false)
});
export type SocketData = z.infer<typeof socketData>;

// 🔹 Fetch messages response schema
export const fetchMessageResponseSchema = z.object({
  message: z.string().optional(),
  chat: z.object({
    groupedMessages: groupedMessages
  })
});
