import { create } from "zustand";

import { createSelectMessagesSlice, type SelectMessagesSlice } from "./select-messages";
import { createMessageSlice, type MessageSlice } from "./messages";
import { createGroupSlice, type GroupSlice } from "./groups";
import { createReplySlice, type ReplySlice } from "./reply";
import { createChatSlice, type ChatSlice } from "./chats";
import { createUserSlice, type UserSlice } from "./user";

type StoreType = ChatSlice & UserSlice & MessageSlice & GroupSlice & SelectMessagesSlice & ReplySlice;

export const useStore = create<StoreType>()((...args) => ({
    ...createSelectMessagesSlice(...args),
    ...createMessageSlice(...args),
    ...createGroupSlice(...args),
    ...createReplySlice(...args),
    ...createChatSlice(...args),
    ...createUserSlice(...args)
}));
