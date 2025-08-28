import { AxiosError } from "axios";
import { toast } from "sonner";
import { StateCreator } from "zustand";

import {
  fetchMessageResponseSchema,
  type ChatMessage,
  type GroupedMessages
} from "@/validations";
import { axiosClient } from "@/lib";
import type { StoreType } from ".";

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
};

export const createMessageSlice: StateCreator<
  StoreType,
  [],
  [],
  MessageSlice
> = (set, get) => ({
  messages: {},
  loading: {},

  fetchMessages: async (chatId) => {
    if (get().messages[chatId]) return;

    set((state) => ({
      loading: { ...state.loading, [chatId]: true }
    }));

    try {
      const response = await axiosClient(`/chat/history/${chatId}`);
      const parsedResponse = fetchMessageResponseSchema.safeParse(response.data);

      if (!parsedResponse.success) {
        console.error("Invalid data from server:", parsedResponse.error);
        toast.error("Invalid data type sent from server");
        return;
      }

      const groupedMessages = parsedResponse.data.chat.groupedMessages;

      // Ensure every message has a status
      for (const groupKey in groupedMessages) {
        groupedMessages[groupKey] = groupedMessages[groupKey].map((msg) => ({
          ...msg,
          status: msg.status || "pending"
        }));
      }

      set((state) => ({
        messages: { ...state.messages, [chatId]: groupedMessages },
        loading: { ...state.loading, [chatId]: false }
      }));
    } catch (error) {
      let message = "An unexpected error was returned from the server";
      if (error instanceof AxiosError) message = error?.response?.data?.message;
      toast.error(message);

      set((state) => ({
        loading: { ...state.loading, [chatId]: false }
      }));
    }
  },

  pushMessage: async (chatDetails, newMessage) => {
    const { addChat, messages, fetchMessages } = get();

    if (!messages[chatDetails.chatId] || Object.keys(messages[chatDetails.chatId]).length === 0) {
      await fetchMessages(chatDetails.chatId);
    }

    if (!messages[chatDetails.chatId]) {
      addChat({
        _id: chatDetails.chat_id,
        chatId: chatDetails.chatId,
        name: chatDetails.chatName,
        phoneNumber: chatDetails.phoneNumber,
        lastMessage: { content: "", messageType: null, timestamp: null },
        unreadCount: 0
      });
      return;
    }

    set((state) => {
      const existingMessages = state.messages[chatDetails.chatId] || {};
      const groupKey = "Today";
      const updatedGroup = [
        ...(existingMessages[groupKey] || []),
        { ...newMessage, status: newMessage.status || "pending" }
      ];

      return {
        messages: {
          ...state.messages,
          [chatDetails.chatId]: {
            ...existingMessages,
            [groupKey]: updatedGroup
          }
        }
      };
    });
  }
});
