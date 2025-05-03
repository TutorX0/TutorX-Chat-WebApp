import { useEffect, useState } from "react";

import { useStore } from "@/store";
import { axiosClient } from "@/lib";
import { userSchema } from "@/validations/user.validation";

export function useFetchUser() {
    const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");

    const user = useStore((state) => state.user);
    const setUser = useStore((state) => state.setUser);

    useEffect(() => {
        async function getUser() {
            if (user) {
                setStatus("success");
                return;
            }

            setStatus("pending");

            const token = window.localStorage.getItem("tutor-x-auth-token");
            if (!token) {
                setStatus("error");
                return;
            }

            try {
                const response = await axiosClient.get("/me", { headers: { Authorization: `Bearer ${token}` } });

                const parsedResponse = userSchema.safeParse(response.data);
                if (!parsedResponse.success) {
                    setStatus("error");
                    return;
                }

                setStatus("success");
                setUser(parsedResponse.data.user);
            } catch (error: unknown) {
                setStatus("error");
            }
        }

        getUser();
    }, []);

    return status;
}
