import type { StateCreator } from "zustand";

import type { GroupSchema } from "@/store/validations";

export type GroupSlice = {
    groups: GroupSchema[] | null;
    setGroups: (newGroups: GroupSchema[]) => void;
    addGroup: (newGroup: GroupSchema) => void;
    removeGroupByName: (groupName: string) => void;
};

export const createGroupSlice: StateCreator<GroupSlice> = (set, get) => ({
    groups: null,
    setGroups: (newGroups) => set({ groups: newGroups }),
    addGroup: (newGroup) => {
        const currentGroups = get().groups;

        const groupIndex = currentGroups?.findIndex((group) => group._id === newGroup._id);

        if (groupIndex !== null && groupIndex !== undefined && groupIndex !== -1) {
            const updatedGroups = currentGroups ? [...currentGroups] : [];
            updatedGroups[groupIndex] = newGroup;
            set({ groups: updatedGroups });
        } else {
            set({ groups: currentGroups ? [...currentGroups, newGroup] : [newGroup] });
        }
    },

    removeGroupByName: (groupName) => {
        const currentGroups = get().groups;
        if (!currentGroups) return;

        const filteredGroups = currentGroups.filter((group) => group.groupName.toLowerCase() !== groupName.toLowerCase());
        set({ groups: filteredGroups });
    }
});
