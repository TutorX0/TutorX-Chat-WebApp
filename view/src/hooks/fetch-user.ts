import { useEffect, useState } from "react";

import { useStore } from "@/store";

export function useFetchUser() {
    const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");

    const user = useStore((state) => state.user);
    const setUser = useStore((state) => state.setUser);

    useEffect(() => {
        async function getUser() {
            setStatus("pending");

            const token = window.localStorage.getItem("tutor-x-auth-token");
            try {
                // TODO: Make an API call here
                // await Promise.reject(new Error("Some random error happened out of nowhere"));
                setStatus("success");
            } catch (error: unknown) {
                console.log("");
                setStatus("error");
            }
        }

        getUser();
    }, []);

    return status;
}
