import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { chatsResponseSchema } from "@/validations";
import { ChatItems } from "./chat-items";
import { Input } from "@/components";
import { axiosClient } from "@/lib";
import { useStore } from "@/store";
import { Pills } from "./pills";

export function ChatSidebar() {
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const chats = useStore((state) => state.chats);
    const setChats = useStore((state) => state.setChats);

    useEffect(() => {
        async function call() {
            if (chats.length > 0) return;

            setLoading(true);
            try {
                const response = await axiosClient.get("/chat/all-chats");

                const parsedResponse = chatsResponseSchema.safeParse(response.data);
                if (!parsedResponse.success) return toast.error("Invalid data type sent from server");

                setChats(parsedResponse.data.chats);
            } catch (error: unknown) {
                let message = "An unexpected error was returned from the server";
                if (error instanceof AxiosError) message = error?.response?.data?.message;
                console.log(message);
            } finally {
                setLoading(false);
            }
        }

        call();
    }, []);

    return (
        <aside className="bg-sidebar flex grow flex-col gap-4 border pt-5">
            <div className="relative px-4">
                <Search className="absolute top-1/2 left-7 size-4 -translate-y-1/2 text-neutral-500" />
                <Input
                    type="text"
                    placeholder="Search ...."
                    className="focus-visible:ring-empty-input-border bg-empty-input focus-visible:bg-sidebar rounded-full pl-9 focus-visible:ring-1"
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <Pills pillTitles={["Chats", "Groups"]} />
            <ChatItems chats={chats} loading={loading} search={search} />
        </aside>
    );
}
