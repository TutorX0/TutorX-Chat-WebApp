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

    const groups = useStore((state) => state.groups);

    const [hasResolvedInitialGroup, setHasResolvedInitialGroup] = useState(false);
    const [groupLoading, setGroupLoading] = useState(false);
    const currentGroupRef = useRef<string | null>(null);

<<<<<<< HEAD
    const filteredByGroup = useMemo(() => {
        if (!groups || !chatType) return chats;

        const matchedGroup = groups.find((group) => group.groupName.toLowerCase() === chatType.toLowerCase());
=======
    // ✅ Group filter
    const filteredByGroup = useMemo(() => {
        if (!groups || !chatType) return chats;

        const matchedGroup = groups.find(
            (group) => group.groupName.toLowerCase() === chatType.toLowerCase()
        );
>>>>>>> 81bdef25041d8e55d92e72bb2f7950aeeb7b8a46

        if (!matchedGroup) return chats;

        const messageIdSet = new Set(matchedGroup.messageIds);
        return chats.filter((chat) => messageIdSet.has(chat.chatId));
    }, [chats, groups, chatType]);

<<<<<<< HEAD
    const filteredChats = useMemo(() => {
        if (!search.trim()) return filteredByGroup;
        return filteredByGroup.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    }, [filteredByGroup, search]);

=======
    // ✅ Search filter
    const filteredChats = useMemo(() => {
        if (!search.trim()) return filteredByGroup;
        return filteredByGroup.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [filteredByGroup, search]);

    // ✅ Group transition smooth loading
>>>>>>> 81bdef25041d8e55d92e72bb2f7950aeeb7b8a46
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
<<<<<<< HEAD
        <ScrollArea className={cn("h-[70vh] grow px-5", chatType === "chats" ? "pb-4" : "")}>
=======
        <ScrollArea
            className={cn("h-[70vh] grow px-5", chatType === "chats" ? "pb-4" : "")}
        >
>>>>>>> 81bdef25041d8e55d92e72bb2f7950aeeb7b8a46
            {groupLoading || loading ? (
                <ChatItemsLoading />
            ) : (
                filteredChats.map((chat) => (
<<<<<<< HEAD
                    <ChatItem key={`Chat-${chat._id}`} name={chat.name} _id={chat._id} chatId={chat.chatId} chatType={chatType} />
=======
                    <ChatItem
                        key={`Chat-${chat._id}`}
                        _id={chat._id}
                        chatId={chat.chatId}
                        chatType={chatType}
                        name={chat.name}
                        lastMessage={chat.lastMessage}         // ✅ new
                        lastMessageType={chat.lastMessageType} // ✅ new
                        lastMessageTime={chat.lastMessageTime} // ✅ new
                    />
>>>>>>> 81bdef25041d8e55d92e72bb2f7950aeeb7b8a46
                ))
            )}

            {chatType !== "chats" ? (
                <div className="bg-sidebar sticky bottom-0 mt-auto flex flex-col items-center justify-between gap-5 border-t px-3 py-6">
<<<<<<< HEAD
                    <SelectChats alreadyAddedChats={filteredByGroup.map((chat) => chat.chatId)} />
=======
                    <SelectChats
                        alreadyAddedChats={filteredByGroup.map((chat) => chat.chatId)}
                    />
>>>>>>> 81bdef25041d8e55d92e72bb2f7950aeeb7b8a46
                    <DeleteGroup chatType={chatType} />
                </div>
            ) : null}
        </ScrollArea>
    );
}
