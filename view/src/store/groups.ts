import type { StateCreator } from "zustand";

import type { GroupSchema } from "@/validations";

export type GroupSlice = {
    groups: GroupSchema[] | null;
    setGroups: (newGroups: GroupSchema[]) => void;
    addGroup: (newGroup: GroupSchema) => void;
};

export const createGroupSlice: StateCreator<GroupSlice> = (set, get) => ({
    groups: null,
    setGroups: (newGroups) => set({ groups: newGroups }),
    addGroup: (newGroup) => {
        const currentGroups = get().groups;
        set({ groups: currentGroups ? [...currentGroups, newGroup] : [newGroup] });
    }
});
