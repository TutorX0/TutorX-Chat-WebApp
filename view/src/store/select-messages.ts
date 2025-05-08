import type { StateCreator } from "zustand";

export type SelectMessagesSlice = {
    selectMessageToggle: boolean;
    selectedMessages: string[];
    setSelectMessageToggle: (value: boolean) => void;
    toggleSelectedMessage: (messageId: string) => void;
};

export const createSelectMessagesSlice: StateCreator<SelectMessagesSlice> = (set, get) => ({
    selectMessageToggle: false,
    selectedMessages: [],

    setSelectMessageToggle: (value: boolean) => {
        set((state) => ({
            selectMessageToggle: value,
            selectedMessages: value ? state.selectedMessages : []
        }));
    },

    toggleSelectedMessage: (messageId: string) => {
        const { selectedMessages } = get();
        const exists = selectedMessages.includes(messageId);

        set({
            selectedMessages: exists ? selectedMessages.filter((id) => id !== messageId) : [...selectedMessages, messageId]
        });
    }
});
