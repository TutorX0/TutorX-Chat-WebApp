import { create } from "zustand";

import { createMessageSlice, type MessageSlice } from "./messages";
import { createChatSlice, type ChatSlice } from "./chats";
import { createUserSlice, type UserSlice } from "./user";

type StoreType = ChatSlice & UserSlice & MessageSlice;

export const useStore = create<StoreType>()((...args) => ({
    ...createUserSlice(...args),
    ...createChatSlice(...args),
    ...createMessageSlice(...args)
}));
