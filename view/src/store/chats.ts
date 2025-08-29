import type { StateCreator } from "zustand";
import type { ChatItem } from "@/validations";

export type ChatSlice = {
    chats: ChatItem[];
    setChats: (newChats: ChatItem[]) => void;
    addChat: (newChat: ChatItem) => void;
    updateChatName: (args: { newChatName: string; phoneNumber: string }) => void;
    moveChatToTop: (phoneNumber: string) => void;

    // 🔥 Unread badge handling
    incrementUnread: (phoneNumber: string) => void;
    resetUnread: (phoneNumber: string) => void;
};

export const createChatSlice: StateCreator<ChatSlice> = (set) => ({
    chats: [],
    setChats: (newChats) => {
        console.log("✅ setChats called with:", newChats);
        set({ chats: newChats.map((c) => ({ ...c, unreadCount: c.unreadCount ?? 0 })) });
    },

    addChat: (newChat) =>
        set((state) => {
            console.log("➕ addChat called with:", newChat);
            const updatedChats = state.chats.filter((chat) => chat.chatId !== newChat.chatId);
            updatedChats.unshift({ ...newChat, unreadCount: newChat.unreadCount ?? 0 }); // default 0
            console.log("📌 Chats after addChat:", updatedChats);
            return { chats: updatedChats };
        }),

    updateChatName: ({ newChatName, phoneNumber }) =>
        set((state) => {
            console.log(`✏️ updateChatName for ${phoneNumber} → ${newChatName}`);
            return {
                chats: state.chats.map((chat) =>
                    chat.phoneNumber === phoneNumber ? { ...chat, name: newChatName } : chat
                )
            };
        }),

    moveChatToTop: (phoneNumber) =>
        set((state) => {
            console.log(`⬆️ moveChatToTop for ${phoneNumber}`);
            const index = state.chats.findIndex((chat) => chat.phoneNumber === phoneNumber);
            if (index === -1) {
                console.warn("⚠️ Chat not found for moveChatToTop:", phoneNumber);
                return {};
            }

            const chatToMove = state.chats[index];
            const filteredChats = state.chats.filter((chat) => chat.phoneNumber !== phoneNumber);
            const updatedChats = [chatToMove, ...filteredChats];

            console.log("📌 Chats after moveChatToTop:", updatedChats);
            return { chats: updatedChats };
        }),

    // 🔥 Increment unread count
    incrementUnread: (phoneNumber) =>
        set((state) => {
            console.log(`📩 incrementUnread for ${phoneNumber}`);
            return {
                chats: state.chats.map((chat) =>
                    chat.phoneNumber === phoneNumber
                        ? { ...chat, unreadCount: (chat.unreadCount ?? 0) + 1 }
                        : chat
                )
            };
        }),

    // 🔥 Reset unread count (when chat is opened)
    resetUnread: (phoneNumber) =>
        set((state) => {
            console.log(`👀 resetUnread for ${phoneNumber}`);
            return {
                chats: state.chats.map((chat) =>
                    chat.phoneNumber === phoneNumber ? { ...chat, unreadCount: 0 } : chat
                )
            };
        })
});
