import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import type { ChatItem as ChatItemType } from "@/validations";
import { ChatItemsLoading } from "../loading";
import { DeleteGroup } from "./delete-group";
import { ScrollArea } from "@/components";
import { useStore } from "@/store";
import { ChatItem } from "./item";
import { cn } from "@/lib";
import { SelectChats } from "@/components/select-chats";

type ChatItemsProps = {
    chats: ChatItemType[];
    loading: boolean;
    search: string;
};

export function ChatItems({ chats, loading, search }: ChatItemsProps) {
    const [searchParams] = useSearchParams();
    const chatType = searchParams.get("chat_type");

    const groups = useStore((state) => state.groups);

    const [basefilteredChats, setBaseFilteredChats] = useState<ChatItemType[]>([]);
    const [filteredChats, setFilteredChats] = useState<ChatItemType[]>([]);

    useEffect(() => {
        const matchedGroup = groups?.find((group) => group.groupName.toLowerCase() === chatType?.toLowerCase());

        if (matchedGroup) {
            const messageIdSet = new Set(matchedGroup.messageIds);
            const filtered = chats.filter((chat) => messageIdSet.has(chat.chatId));
            setBaseFilteredChats(filtered);
        } else {
            setBaseFilteredChats(chats);
        }
    }, [chatType, groups, chats]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!search) setFilteredChats(basefilteredChats);
            else {
                setFilteredChats(() => {
                    return basefilteredChats.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
                });
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [basefilteredChats, search]);

    return (
        <ScrollArea className={cn("h-[70vh] grow px-5", chatType === "chats" ? "pb-4" : "")}>
            {loading ? (
                <ChatItemsLoading />
            ) : (
                filteredChats.map((chat) => (
                    <ChatItem name={chat.name} _id={chat._id} chatId={chat.chatId} key={`Chat-${chat._id}`} chatType={chatType} />
                ))
            )}
            {chatType !== "chats" ? (
                <div className="bg-sidebar sticky bottom-0 mt-auto flex flex-col items-center justify-between gap-x-6 gap-y-4 border-t px-2 py-4 sm:flex-row md:flex-col lg:flex-row">
                    <DeleteGroup chatType={chatType} />
                    <SelectChats alreadyAddedChats={basefilteredChats.map((chat) => chat.chatId)} />
                </div>
            ) : null}
        </ScrollArea>
    );
}
