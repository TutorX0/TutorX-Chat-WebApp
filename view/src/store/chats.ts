<<<<<<< HEAD
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
    addChat: (newChat) =>
        set((state) => {
            const updatedChats = state.chats.filter((chat) => chat.chatId !== newChat.chatId);
            updatedChats.unshift(newChat);
            return { chats: updatedChats };
        }),
    updateChatName: ({ newChatName, phoneNumber }) =>
        set((state) => ({
            chats: state.chats.map((chat) => (chat.phoneNumber === phoneNumber ? { ...chat, name: newChatName } : chat))
        })),
    moveChatToTop: (phoneNumber) =>
        set((state) => {
            const index = state.chats.findIndex((chat) => chat.phoneNumber === phoneNumber);
            if (index === -1) return {}; // Chat not found, no update

            const chatToMove = state.chats[index];
            const filteredChats = state.chats.filter((chat) => chat.phoneNumber !== phoneNumber);
            const updatedChats = [chatToMove, ...filteredChats];

            return { chats: updatedChats };
        })
});
=======
import { create } from "zustand";
import { ChatItem, ChatMessage } from "@/validations";

interface ChatState {
  chats: ChatItem[];
  activeChatId: string | null;
  setActiveChat: (chatId: string) => void;
  pushMessage: (chat: Partial<ChatItem>, message: ChatMessage) => void;
  moveChatToTop: (phoneNumber: string) => void;

  // ✅ New: unread handling
  incrementUnreadCount: (chatId: string) => void;
  resetUnreadCount: (chatId: string) => void;
}

export const useStore = create<ChatState>((set, get) => ({
  chats: [],
  activeChatId: null,

  setActiveChat: (chatId) => {
    set({ activeChatId: chatId });
    // ✅ Chat open hote hi unread reset ho
    get().resetUnreadCount(chatId);
  },

  pushMessage: (chat, message) => {
    set((state) => ({
      chats: state.chats.map((c) =>
        c.chatId === chat.chatId
          ? { ...c, lastMessage: message.content ?? "", lastMessageTime: message.createdAt }
          : c
      ),
    }));
  },

  moveChatToTop: (phoneNumber) => {
    set((state) => {
      const idx = state.chats.findIndex((c) => c.phoneNumber === phoneNumber);
      if (idx === -1) return state;
      const chat = state.chats[idx];
      const newChats = [...state.chats];
      newChats.splice(idx, 1);
      return { chats: [chat, ...newChats] };
    });
  },

  // ✅ increment unread count
  incrementUnreadCount: (chatId) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.chatId === chatId
          ? { ...chat, unreadCount: (chat.unreadCount || 0) + 1 }
          : chat
      ),
    }));
  },

  // ✅ reset unread count
  resetUnreadCount: (chatId) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.chatId === chatId ? { ...chat, unreadCount: 0 } : chat
      ),
    }));
  },
}));
>>>>>>> 81bdef25041d8e55d92e72bb2f7950aeeb7b8a46
