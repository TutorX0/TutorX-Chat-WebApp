import type { StateCreator } from "zustand";
import { ChatItem, ChatMessage } from "@/validations";
import type { StoreType } from ".";

export interface ChatState {
  chats: ChatItem[];
  activeChatId: string | null;
  setActiveChat: (chatId: string) => void;
  pushMessage: (chat: Partial<ChatItem>, message: ChatMessage) => void;
  moveChatToTop: (phoneNumber: string) => void;

  // ✅ unread handling
  incrementUnreadCount: (chatId: string) => void;
  resetUnreadCount: (chatId: string) => void;
}

// ✅ Slice factory export (like messages.ts)
export const createChatSlice: StateCreator<StoreType, [], [], ChatState> = (set, get) => ({
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
});
