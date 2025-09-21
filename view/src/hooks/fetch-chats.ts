import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { chatsResponseSchema } from "@/validations";
import { axiosClient } from "@/lib";
import { useStore } from "@/store";

export function useFetchChats() {
    const [loading, setLoading] = useState(false);

    const chats = useStore((state) => state.chats);
    const setChats = useStore((state) => state.setChats);

    useEffect(() => {
        async function fetchChats() {
            if (chats.length > 0) return;

            setLoading(true);
            try {
                const response = await axiosClient.get("/chat/all-chats");
                // 👇 Yaha dump karo raw response
    // //console.log("📡 API /chat/all-chats raw:", response.data);
                const parsedResponse = chatsResponseSchema.safeParse(response.data);
                if (!parsedResponse.success) return toast.error("Invalid data type sent from server");

                setChats(parsedResponse.data.chats);
            } catch (error: unknown) {
                let message = "An unexpected error was returned from the server";
                if (error instanceof AxiosError) message = error?.response?.data?.message;
                toast.error(message);
            } finally {
                setLoading(false);
            }
        }

        fetchChats();
    }, []);

    return { loading };
}