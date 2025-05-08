import type { StateCreator } from "zustand";

export type Reply = {
    messageId: string;
    content?: string;
    sentBy: string;
    messageType: string;
};

export type ReplySlice = {
    replyMessage: Reply | null;
    setReplyMessage: (reply: Reply | null) => void;
};

export const createReplySlice: StateCreator<ReplySlice> = (set) => ({
    replyMessage: null,
    setReplyMessage: (reply) => set({ replyMessage: reply })
});
