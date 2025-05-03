import type { StateCreator } from "zustand";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { fetchMessageResponseSchema, type ChatMessage } from "@/validations";
import { axiosClient } from "@/lib";

type MessageItem = ChatMessage;

export type MessageSlice = {
    messages: Record<string, MessageItem[]>; // Key: chatId or phoneNumber
    hasMore: Record<string, boolean>; // Track if more messages can be loaded per chat
    loading: Record<string, boolean>; // Track loading state per chat
    page: Record<string, number>; // Track pages fetched per chat
    fetchMessages: (chatId: string) => Promise<void>;
    loadMoreMessages: (chatId: string) => Promise<void>;
};

export const createMessageSlice: StateCreator<MessageSlice> = (set, get) => ({
    messages: {},
    hasMore: {},
    loading: {},
    page: {},

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
                messages: { ...state.messages, [chatId]: parsedResponse.data.chat.messages },
                hasMore: { ...state.hasMore, [chatId]: parsedResponse.data.currentPage < parsedResponse.data.totalPages },
                page: { ...state.page, [chatId]: (state.page[chatId] ?? 0) + 1 },
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

    loadMoreMessages: async (chatId) => {
        if (!get().hasMore[chatId]) return; // No more messages
        if (get().loading[chatId]) return; // Already loading

        set((state) => ({
            loading: { ...state.loading, [chatId]: true }
        }));

        try {
            const response = await axiosClient(`/chat/history/${chatId}?page=${get().messages[chatId] ?? 1}`);

            const parsedResponse = fetchMessageResponseSchema.safeParse(response.data);
            if (!parsedResponse.success) {
                toast.error("Invalid data type sent from server");
                return;
            }

            set((state) => ({
                messages: {
                    ...state.messages,
                    [chatId]: [...state.messages[chatId], ...parsedResponse.data.chat.messages]
                },
                hasMore: {
                    ...state.hasMore,
                    [chatId]: parsedResponse.data.currentPage < parsedResponse.data.totalPages
                },
                page: { ...state.page, [chatId]: (state.page[chatId] ?? 0) + 1 },
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
    }
});
