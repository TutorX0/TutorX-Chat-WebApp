import { useSearchParams } from "react-router-dom";
import { UserCircle } from "lucide-react";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components";
import {
    groupCreationResponseSchema,
    type ChatItem as ChatItemType,
} from "@/validations";
import { useUpdateSearchParam } from "@/hooks";
import { axiosClient } from "@/lib";
import { useStore } from "@/store";

// ✅ extended type with unreadCount
type ChatItemProps = Pick<ChatItemType, "_id" | "name" | "lastMessage" | "unreadCount"> & {
    chatType: string | null;
    chatId: string;
};

export function ChatItem({ _id, chatId, chatType, name, lastMessage, unreadCount }: ChatItemProps) {
    const [loading, setLoading] = useState(false);
    const addGroup = useStore((state) => state.addGroup);

    async function removeFromGroup() {
        if (loading) return;

        setLoading(true);
        try {
            const response = await axiosClient.put("/group/remove-users", {
                groupName: chatType,
                messageId: chatId,
            });

            const parsedResponse = groupCreationResponseSchema.safeParse(response.data);
            if (!parsedResponse.success)
                return toast.error("Invalid data type sent from server");

            addGroup(parsedResponse.data.group);
            toast.success(response.data.message);
        } catch (error: unknown) {
            let message = "An unexpected error was returned from the server";
            if (error instanceof AxiosError) message = error?.response?.data?.message;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return chatType === "chats" ? (
        <Item
            name={name}
            _id={_id}
            chatType={chatType}
            chatId={chatId}
            lastMessage={lastMessage}
            unreadCount={unreadCount}
        />
    ) : (
        <ContextMenu>
            <ContextMenuTrigger>
                <Item
                    name={name}
                    _id={_id}
                    chatType={chatType}
                    chatId={chatId}
                    lastMessage={lastMessage}
                    unreadCount={unreadCount}
                />
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={removeFromGroup} disabled={loading}>
                    Remove from group
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}

function Item({ _id, name, lastMessage, chatId, unreadCount }: ChatItemProps) {
    const updateSearchParam = useUpdateSearchParam();
    const [searchParams] = useSearchParams();
    const resetUnread = useStore((s) => s.resetUnread);

    // 🔹 Fallback: if name is empty, show WhatsApp default username
    const displayName = name?.trim()
        ? name
        : chatId
        ? `+${chatId.slice(-10)}`
        : "Unknown";

    const handleClick = () => {
        console.log(`[ChatItem] Opening chat: ${chatId} → resetting unread`);
        resetUnread(chatId); // 🔥 Reset unread on open
        updateSearchParam("open", _id);
    };

    return (
        <div
            className="data-[active=true]:bg-selected-chat hover:bg-chat-hover my-2 flex cursor-pointer items-center gap-4 rounded-md p-3"
            data-active={searchParams.get("open") === _id}
            onClick={handleClick}
        >
            <UserCircle
                strokeWidth="1"
                className="size-8 rounded-full text-neutral-500"
            />
            <div className="flex flex-col overflow-hidden flex-1">
                <div className="flex justify-between items-center">
                    <p className="font-semibold truncate">{displayName}</p>
                    {/* 🔥 Unread badge on right */}
                    {unreadCount && unreadCount > 0 && (
                        <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                            {unreadCount}
                        </span>
                    )}
                </div>
                {lastMessage && lastMessage.content !== null ? (
                    <p className="text-sm text-neutral-500 truncate">
                        {lastMessage.content || "[Media Message]"}
                    </p>
                ) : (
                    <p className="text-sm text-neutral-400 italic">
                        No messages yet
                    </p>
                )}
            </div>
        </div>
    );
}
