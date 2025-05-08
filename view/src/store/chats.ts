import type { StateCreator } from "zustand";

import type { ChatItem } from "@/validations";

export type ChatSlice = {
    chats: ChatItem[];
    setChats: (newChats: ChatItem[]) => void;
    addChat: (newChat: ChatItem) => void;
    updateChatName: (args: { newChatName: string; phoneNumber: string }) => void;
};

export const createChatSlice: StateCreator<ChatSlice> = (set) => ({
    chats: [],
    setChats: (newChats) => set({ chats: newChats }),
    addChat: (newChat) => set((state) => ({ chats: [newChat, ...state.chats] })),
    updateChatName: ({ newChatName, phoneNumber }) =>
        set((state) => ({
            chats: state.chats.map((chat) => (chat.phoneNumber === phoneNumber ? { ...chat, name: newChatName } : chat))
        }))
});
