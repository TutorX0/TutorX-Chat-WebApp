import { z } from "zod";

// 🔹 Base fields for all chats
const base = {
  _id: z.string(),
  chatId: z.string(),
  phoneNumber: z.string(),
  name: z.string(),
  unreadCount: z.number().optional().default(0), // optional, default to 0
};

// 🔹 Server v2 shape (nested lastMessage)
const serverV2 = z.object({
  ...base,
  lastMessage: z
    .object({
      content: z.string().nullable().optional(),
      messageType: z.string().nullable().optional(),
      timestamp: z.union([z.string(), z.date()]).nullable().optional(),
    })
    .nullable()
    .optional(),
});

// 🔹 Server v1 shape (flat lastMessage)
const serverV1 = z.object({
  ...base,
  lastMessage: z.string().nullable().optional(),
  lastMessageType: z.string().nullable().optional(),
  lastMessageTime: z.union([z.string(), z.date()]).nullable().optional(),
});

// 🔹 Union both server shapes and normalize
export const chatSchema = z
  .union([serverV2, serverV1])
  .transform((data) => {
    const common = {
      _id: data._id,
      chatId: data.chatId,
      phoneNumber: data.phoneNumber,
      name: data.name,
      unreadCount: (data as any).unreadCount ?? 0,
    };

    // v2 nested
    if (
      "lastMessage" in data &&
      typeof data.lastMessage === "object" &&
      data.lastMessage !== null &&
      !Array.isArray(data.lastMessage)
    ) {
      const ts = data.lastMessage?.timestamp ?? null;
      return {
        ...common,
        lastMessage: {
          content: data.lastMessage?.content ?? "",
          messageType: data.lastMessage?.messageType ?? null,
          timestamp: ts instanceof Date ? ts.toISOString() : (ts ?? null),
        },
      };
    }

    // v1 flat
    const ts = (data as any).lastMessageTime ?? null;
    const content = (data as any).lastMessage ?? "";
    const messageType = (data as any).lastMessageType ?? null;

    return {
      ...common,
      lastMessage: {
        content,
        messageType,
        timestamp: ts instanceof Date ? ts.toISOString() : (ts ?? null),
      },
    };
  });

// 🔄 Response schema
export const chatsResponseSchema = z.object({
  status: z.string(),
  totalChats: z.number(),
  chats: z.array(chatSchema),
});

// 🧠 Type for normalized ChatItem
export type ChatItem = z.infer<typeof chatSchema>;

// No change here; backend doesn’t send lastMessage in this POST response
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
    _id: z.string(),
  }),
});
