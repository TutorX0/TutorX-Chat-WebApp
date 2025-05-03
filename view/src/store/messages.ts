import type { StateCreator } from "zustand";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { fetchMessageResponseSchema, type GroupedMessages } from "@/validations";
import { axiosClient } from "@/lib";

export type MessageSlice = {
    messages: Record<string, GroupedMessages>; // Key: chatId or phoneNumber
    loading: Record<string, boolean>; // Track loading state per chat
    fetchMessages: (chatId: string) => Promise<void>;
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
    }
});
