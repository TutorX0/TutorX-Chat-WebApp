import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import type { ChatItem as ChatItemType } from "@/validations";
import { SelectChats } from "@/components/select-chats";
import { ChatItemsLoading } from "../loading";
import { DeleteGroup } from "./delete-group";
import { ScrollArea } from "@/components";
import { useStore } from "@/store";
import { ChatItem } from "./item";
import { cn } from "@/lib";

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
    const [searchLoading, setSearchLoading] = useState(false);
    const [groupLoading, setGroupLoading] = useState(false);

    function findMatchedGroup() {
        const matchedGroup = groups?.find((group) => group.groupName.toLowerCase() === chatType?.toLowerCase());
        let filtered: ChatItemType[] = [];

        if (matchedGroup) {
            const messageIdSet = new Set(matchedGroup.messageIds);
            filtered = chats.filter((chat) => messageIdSet.has(chat.chatId));
        } else {
            filtered = chats;
        }

        return filtered;
    }

    useEffect(() => {
        setGroupLoading(true);

        const filtered = findMatchedGroup();

        const timeoutId = setTimeout(() => {
            setBaseFilteredChats(filtered);
            setGroupLoading(false);
        }, 200);

        return () => clearTimeout(timeoutId);
    }, [chatType, groups]);

    useEffect(() => {
        const filtered = findMatchedGroup();
        setBaseFilteredChats(filtered);
    }, [chats]);

    useEffect(() => {
        // setGroupLoading(true);
        setSearchLoading(true);

        const timeoutId = setTimeout(() => {
            if (!search) setFilteredChats(basefilteredChats);
            else {
                setFilteredChats(() => {
                    return basefilteredChats.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
                });
            }
            // setGroupLoading(false);
            setSearchLoading(false);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [basefilteredChats, search]);

    return (
        <ScrollArea className={cn("h-[70vh] grow px-5", chatType === "chats" ? "pb-4" : "")}>
            {groupLoading || loading || searchLoading ? (
                <ChatItemsLoading />
            ) : (
                filteredChats.map((chat) => (
                    <ChatItem name={chat.name} _id={chat._id} chatId={chat.chatId} key={`Chat-${chat._id}`} chatType={chatType} />
                ))
            )}
            {chatType !== "chats" ? (
                <div className="bg-sidebar sticky bottom-0 mt-auto flex flex-col items-center justify-between gap-5 border-t px-3 py-6">
                    <SelectChats alreadyAddedChats={basefilteredChats.map((chat) => chat.chatId)} />
                    <DeleteGroup chatType={chatType} />
                </div>
            ) : null}
        </ScrollArea>
    );
}
