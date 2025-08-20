import type { StateCreator } from "zustand";

export type SelectedMessage = {
    type: string;
    content: string | undefined;
    mediaUrl: string | null;
    id: string;
};

export type SelectMessagesSlice = {
    selectMessageToggle: boolean;
    selectedMessages: SelectedMessage[];
    setSelectMessageToggle: (value: boolean) => void;
    toggleSelectedMessage: (message: SelectedMessage) => void;
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

    toggleSelectedMessage: (message) => {
        const { selectedMessages } = get();
        const exists = selectedMessages.find((selectedMessage) => selectedMessage.id === message.id);

        set({
            selectedMessages: exists
                ? selectedMessages.filter((element) => element.id !== message.id)
                : [...selectedMessages, message]
        });
    }
});
