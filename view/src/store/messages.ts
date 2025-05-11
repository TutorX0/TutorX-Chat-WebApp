import type { StateCreator } from "zustand";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { fetchMessageResponseSchema, type ChatMessage, type GroupedMessages } from "@/validations";
import { axiosClient } from "@/lib";

export type MessageRecord = Record<string, GroupedMessages>;

export type MessageSlice = {
    messages: MessageRecord;
    loading: Record<string, boolean>;
    fetchMessages: (chatId: string) => Promise<void>;
    pushMessage: (chatId: string, newMessage: ChatMessage) => void;
};

export const createMessageSlice: StateCreator<MessageSlice> = (set, get) => ({
    messages: {},
    loading: {},

    fetchMessages: async (chatId) => {
        if (get().messages[chatId]) return; // Already fetched

        set((state) => ({
            loading: { ...state.loading, [chatId]: true }
        }));

        try {
            const response = await axiosClient(`/chat/history/${chatId}`);

            const parsedResponse = fetchMessageResponseSchema.safeParse(response.data);
            if (!parsedResponse.success) {
                toast.error("Invalid data type sent from server");
                return;
            }

            set((state) => ({
                messages: { ...state.messages, [chatId]: parsedResponse.data.chat.groupedMessages },
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

    pushMessage: async (chatId, newMessage) => {
        const { messages, fetchMessages } = get();

        if (!messages[chatId] || Object.keys(messages[chatId]).length === 0) await fetchMessages(chatId);

        set((state) => {
            const existingMessages = state.messages[chatId] || {};
            const groupKey = "Today";
            const updatedGroup = [...(existingMessages[groupKey] || []), newMessage];

            return {
                messages: {
                    ...state.messages,
                    [chatId]: {
                        ...existingMessages,
                        [groupKey]: updatedGroup
                    }
                }
            };
        });
    }
});
