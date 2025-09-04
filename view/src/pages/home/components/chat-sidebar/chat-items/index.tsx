import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState, useMemo } from "react";

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
    console.log("chat types: ", chatType)

    const groups = useStore((state) => state.groups);

    const [hasResolvedInitialGroup, setHasResolvedInitialGroup] = useState(false);
    const [groupLoading, setGroupLoading] = useState(false);
    const currentGroupRef = useRef<string | null>(null);

    const filteredByGroup = useMemo(() => {
        if (!groups || !chatType) return chats;

        const matchedGroup = groups.find((group) => group.groupName.toLowerCase() === chatType.toLowerCase());

        if (!matchedGroup) return chats;

        const messageIdSet = new Set(matchedGroup.messageIds);
        return chats.filter((chat) => messageIdSet.has(chat.chatId));
    }, [chats, groups, chatType]);

    const filteredChats = useMemo(() => {
        if (!search.trim()) return filteredByGroup;
        return filteredByGroup.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    }, [filteredByGroup, search]);

    useEffect(() => {
        const normalized = chatType?.toLowerCase() || null;
        if (normalized !== currentGroupRef.current) {
            currentGroupRef.current = normalized;
            setHasResolvedInitialGroup(false);
            setGroupLoading(true);

            const timer = setTimeout(() => {
                setGroupLoading(false);
                setHasResolvedInitialGroup(true);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [chatType]);

    useEffect(() => {
        if (!hasResolvedInitialGroup && !groupLoading) setHasResolvedInitialGroup(true);
        if (groupLoading && hasResolvedInitialGroup) setGroupLoading(false);
    }, [filteredChats, groupLoading, hasResolvedInitialGroup]);

    return (
        <ScrollArea className={cn("h-[70vh] grow px-5", chatType === "chats" ? "pb-4" : "")}>
            {groupLoading || loading ? (
                <ChatItemsLoading />
            ) : (
                filteredChats.map((chat) => (
                    <ChatItem key={`Chat-${chat._id}`} name={chat.name} _id={chat._id} chatId={chat.chatId} chatType={chatType}
                    lastMessage={chat.lastMessage}
                    unreadCount={chat.unreadCount}
                    />
                ))
            )}

            {chatType !== "chats" && chatType!=="templates" ? (
                <div className="bg-sidebar sticky bottom-0 mt-auto flex flex-col items-center justify-between gap-5 border-t px-3 py-6">
                    <SelectChats alreadyAddedChats={filteredByGroup.map((chat) => chat.chatId)} />
                    <DeleteGroup chatType={chatType} />
                </div>
            ) : null}
        </ScrollArea>
    );
}