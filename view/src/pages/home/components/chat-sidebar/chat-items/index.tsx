import { useEffect, useState } from "react";

import type { ChatItem as ChatItemType } from "@/validations";
import { ChatItemsLoading } from "../loading";
import { ScrollArea } from "@/components";
import { ChatItem } from "./item";

type ChatItemsProps = {
    chats: ChatItemType[];
    loading: boolean;
    search: string;
};

export function ChatItems({ chats, loading, search }: ChatItemsProps) {
    const [filteredChats, setFilteredChats] = useState<ChatItemType[]>([]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!search) setFilteredChats(chats);
            else {
                setFilteredChats(() => {
                    console.log("This is superb");
                    return chats.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
                });
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [chats, search]);

    return (
        <ScrollArea className="h-[70vh] grow px-5 pb-4">
            {loading ? (
                <ChatItemsLoading />
            ) : (
                filteredChats.map((chat) => <ChatItem name={chat.name} _id={chat._id} key={`Chat-${chat._id}`} />)
            )}
        </ScrollArea>
    );
}
