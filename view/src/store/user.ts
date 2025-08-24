import type { StateCreator } from "zustand";

import type { UserType } from "@/store/validations";

export type UserSlice = {
    user: UserType | null;
    setUser: (newUser: UserType) => void;
    removeUser: () => void;
    logout: () => void;
};

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
    user: null,
    setUser: (newUser) => set({ user: newUser }),
    removeUser: () => set({ user: null }),
    logout: () => {
        set({ user: null });
        window.localStorage.removeItem("tutor-x-auth-token");
    }
});
