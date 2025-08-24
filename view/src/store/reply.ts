import type { StateCreator } from "zustand";

import type { Reply } from "@/validations";

export type ReplySlice = {
    replyMessage: Reply | null;
    setReplyMessage: (reply: Reply | null) => void;
};

export const createReplySlice: StateCreator<ReplySlice> = (set) => ({
    replyMessage: null,
    setReplyMessage: (reply) => set({ replyMessage: reply })
});
