import type { StateCreator } from "zustand";

import type { ChatItem } from "@/validations";

export type ChatSlice = {
    chats: ChatItem[];
    setChats: (newChats: ChatItem[]) => void;
    addChat: (newChat: ChatItem) => void;
    updateChatName: (args: { newChatName: string; phoneNumber: string }) => void;
    moveChatToTop: (phoneNumber: string) => void;
};

export const createChatSlice: StateCreator<ChatSlice> = (set) => ({
    chats: [],
    setChats: (newChats) => set({ chats: newChats }),
    addChat: (newChat) => set((state) => ({ chats: [newChat, ...state.chats] })),
    updateChatName: ({ newChatName, phoneNumber }) =>
        set((state) => ({
            chats: state.chats.map((chat) => (chat.phoneNumber === phoneNumber ? { ...chat, name: newChatName } : chat))
        })),
    moveChatToTop: (phoneNumber) =>
        set((state) => {
            const index = state.chats.findIndex((chat) => chat.phoneNumber === phoneNumber);
            if (index === -1) return {}; // Chat not found, no update
            const chatToMove = state.chats[index];
            const updatedChats = [chatToMove, ...state.chats.filter((_, i) => i !== index)];
            return { chats: updatedChats };
        })
});
