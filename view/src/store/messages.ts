import { AxiosError } from "axios";
import { toast } from "sonner";
import { StateCreator } from "zustand";

import {
  fetchMessageResponseSchema,
  type ChatMessage,
  type GroupedMessages,
} from "@/validations";
import { axiosClient } from "@/lib";
import type { StoreType } from ".";

// ✅ Strictly allowed statuses
const allowedStatuses = ["pending", "sent", "delivered", "read", "failed"] as const;
export type MessageStatus = typeof allowedStatuses[number];

// ✅ Normalize unknown status from backend → safe union
function normalizeStatus(status: string | undefined): MessageStatus {
  return (allowedStatuses.includes(status as MessageStatus)
    ? status
    : "pending") as MessageStatus;
}

export type MessageRecord = Record<string, GroupedMessages>;

type ChatDetails = {
  chat_id: string;
  chatId: string;
  chatName: string;
  phoneNumber: string;
};

export type MessageSlice = {
  messages: MessageRecord;
  loading: Record<string, boolean>;
  fetchMessages: (chatId: string) => Promise<void>;
  pushMessage: (chatDetails: ChatDetails, newMessage: ChatMessage) => void;
  updateMessageStatus: (
    chatId: string,
    whatsappMessageId: string,
    newStatus: string
  ) => void;

  // ⭐ helpers
  getFirstUnreadId: (chatId: string) => string | null;
  markAllAsRead: (chatId: string) => void;
  getUnreadCount: (chatId: string) => number; // ⭐ NEW
};

export const createMessageSlice: StateCreator<
  StoreType,
  [],
  [],
  MessageSlice
> = (set, get) => ({
  messages: {},
  loading: {},

  // 🔥 Fetch messages from API
  fetchMessages: async (chatId) => {
    console.log(get()); // ✅ fix: call get()

    if (get().messages[chatId]) return;

    set((state) => ({
      loading: { ...state.loading, [chatId]: true },
    }));

    try {
      const response = await axiosClient(`/chat/history/${chatId}`);
      console.log("📡 API /chat/history/:chatId raw:", response);
      const parsedResponse = fetchMessageResponseSchema.safeParse(response.data);

      if (!parsedResponse.success) {
        console.error("❌ Invalid data from server:", parsedResponse.error);
        toast.error("Invalid data type sent from server");
        return;
      }

      const groupedMessages = parsedResponse.data.chat.groupedMessages;

      // ✅ Preserve backend status but normalize
      for (const groupKey in groupedMessages) {
        groupedMessages[groupKey] = groupedMessages[groupKey].map((msg) => ({
          ...msg,
          status: normalizeStatus(msg.status),
          read: msg.read ?? false, // ⭐ keep backend `read`
        }));
      }

      // ⭐ After fetching, mark everything as read immediately
      const updatedGroups = Object.fromEntries(
        Object.entries(groupedMessages).map(([groupKey, msgs]) => [
          groupKey,
          msgs.map((msg) => ({
            ...msg,
            read: true,
            status: "read" as MessageStatus,
          })),
        ])
      );

      set((state) => ({
        messages: { ...state.messages, [chatId]: updatedGroups },
        loading: { ...state.loading, [chatId]: false },
        chats: state.chats.map((chat) =>
          chat.chatId === chatId ? { ...chat, unreadCount: 0 } : chat // ⭐ reset unread badge
        ),
      }));
    } catch (error) {
      let message = "An unexpected error was returned from the server";
      if (error instanceof AxiosError) {
        message = error?.response?.data?.message ?? message;
      }
      toast.error(message);

      set((state) => ({
        loading: { ...state.loading, [chatId]: false },
      }));
    }
  },

  // 🔥 Push a new message locally
  pushMessage: (chatDetails, newMessage) => {
    set((state) => {
      const existingMessages = state.messages[chatDetails.chatId] || {};

      // Use createdAt, not timestamp
      const groupKey = new Date(newMessage.createdAt || Date.now()).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric", year: "numeric" }
      );

      const updatedGroup = [
        ...(existingMessages[groupKey] || []),
        { 
          ...newMessage, 
          status: normalizeStatus(newMessage.status), // ✅ normalize
          // ⭐ fix: outgoing messages are always "read"
          read: newMessage.sender === "admin" ? true : newMessage.read ?? false,
        },
      ];

      let updatedChats = state.chats;
      const chatIndex = state.chats.findIndex(
        (c) => c.chatId === chatDetails.chatId
      );

      if (chatIndex === -1) {
        // New chat
        updatedChats = [
          ...state.chats,
          {
            _id: chatDetails.chat_id,
            chatId: chatDetails.chatId,
            name: chatDetails.chatName,
            phoneNumber: chatDetails.phoneNumber,
            lastMessage: {
              content: newMessage.content,
              messageType: newMessage.type,
              timestamp: newMessage.createdAt,
              status: normalizeStatus(newMessage.status), // ✅ normalize
            },
            unreadCount: 0,
          },
        ];
      } else {
        // Existing chat
        updatedChats = state.chats.map((chat, i) =>
          i === chatIndex
            ? {
                ...chat,
                lastMessage: {
                  content: newMessage.content,
                  messageType: newMessage.type,
                  timestamp: newMessage.createdAt,
                  status: normalizeStatus(newMessage.status), // ✅ normalize
                },
              }
            : chat
        );
      }

      return {
        messages: {
          ...state.messages,
          [chatDetails.chatId]: {
            ...existingMessages,
            [groupKey]: updatedGroup,
          },
        },
        chats: updatedChats,
      };
    });
  },

  updateMessageStatus: (chatId, whatsappMessageId, newStatus) =>
    set((state) => {
      const chatMessages = state.messages[chatId];
      if (!chatMessages) return state;

      const updatedGroups = Object.fromEntries(
        Object.entries(chatMessages).map(([groupKey, msgs]) => [
          groupKey,
          msgs.map((msg) =>
            msg._id === whatsappMessageId
              ? { 
                  ...msg, 
                  status: normalizeStatus(newStatus),
                  read: newStatus === "read" ? true : msg.read, // ⭐ flip read
                }
              : msg
          ),
        ])
      );

      console.log(
        `🟢 Status updated → chatId:${chatId}, whatsappMsgId:${whatsappMessageId}, status:${normalizeStatus(
          newStatus
        )}`
      );

      return {
        messages: {
          ...state.messages,
          [chatId]: updatedGroups,
        },
      };
    }),

  // ⭐ added → for divider
  getFirstUnreadId: (chatId) => {
    const messages = get().messages[chatId];
    if (!messages) return null;

    const flat = Object.values(messages).flat();
    const unreadMsg = flat.find((msg) => !msg.read);

    return unreadMsg?._id ?? null;
  },

  // ⭐ added → manual reset helper
  markAllAsRead: (chatId) =>
    set((state) => {
      const chatMessages = state.messages[chatId];
      if (!chatMessages) return state;

      const updatedGroups = Object.fromEntries(
        Object.entries(chatMessages).map(([groupKey, msgs]) => [
          groupKey,
          msgs.map((msg) => ({ ...msg, read: true, status: "read" as MessageStatus })),
        ])
      );

      return {
        messages: {
          ...state.messages,
          [chatId]: updatedGroups,
        },
        chats: state.chats.map((chat) =>
          chat.chatId === chatId ? { ...chat, unreadCount: 0 } : chat
        ),
      };
    }),

  // ⭐ new → unread count
  getUnreadCount: (chatId) => {
    const messages = get().messages[chatId];
    if (!messages) return 0;

    const flat = Object.values(messages).flat();

    // only count messages that are unread AND not sent by admin
    return flat.filter((msg) => !msg.read && msg.sender !== "admin").length;
  },
});
