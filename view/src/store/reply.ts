import type { StateCreator } from "zustand";

type Reply = {
    messageId: string;
    content?: string;
    sentBy: string;
};

export type ReplySlice = {
    replyMessage: Reply | null;
    setReplyMessage: (reply: Reply | null) => void;
};

export const createReplySlice: StateCreator<ReplySlice> = (set) => ({
    replyMessage: null,
    setReplyMessage: (reply) => set({ replyMessage: reply })
});
