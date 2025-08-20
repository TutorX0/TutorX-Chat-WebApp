import { useSearchParams } from "react-router-dom";
import { UserCircle } from "lucide-react";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

<<<<<<< HEAD
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components";
import { groupCreationResponseSchema, type ChatItem } from "@/validations";
=======
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components";
import {
    groupCreationResponseSchema,
    type ChatItem,
} from "@/validations";
>>>>>>> 81bdef25041d8e55d92e72bb2f7950aeeb7b8a46
import { useUpdateSearchParam } from "@/hooks";
import { axiosClient } from "@/lib";
import { useStore } from "@/store";

<<<<<<< HEAD
type ChatItemProps = Pick<ChatItem, "_id" | "name"> & {
=======
type ChatItemProps = Pick<
    ChatItem,
    "_id" | "name" | "lastMessage" | "lastMessageTime" | "unreadCount"
> & {
>>>>>>> 81bdef25041d8e55d92e72bb2f7950aeeb7b8a46
    chatType: string | null;
    chatId: string;
};

<<<<<<< HEAD
export function ChatItem({ _id, chatId, chatType, name }: ChatItemProps) {
=======
export function ChatItem({ _id, chatId, chatType, name, lastMessage, lastMessageTime, unreadCount }: ChatItemProps) {
>>>>>>> 81bdef25041d8e55d92e72bb2f7950aeeb7b8a46
    const [loading, setLoading] = useState(false);
    const addGroup = useStore((state) => state.addGroup);

    async function removeFromGroup() {
        if (loading) return;

        setLoading(true);
        try {
<<<<<<< HEAD
            const response = await axiosClient.put("/group/remove-users", { groupName: chatType, messageId: chatId });

            const parsedResponse = groupCreationResponseSchema.safeParse(response.data);
            if (!parsedResponse.success) return toast.error("Invalid data type sent from server");
=======
            const response = await axiosClient.put("/group/remove-users", {
                groupName: chatType,
                messageId: chatId,
            });

            const parsedResponse = groupCreationResponseSchema.safeParse(
                response.data
            );
            if (!parsedResponse.success)
                return toast.error("Invalid data type sent from server");
>>>>>>> 81bdef25041d8e55d92e72bb2f7950aeeb7b8a46

            addGroup(parsedResponse.data.group);
            toast.success(response.data.message);
        } catch (error: unknown) {
            let message = "An unexpected error was returned from the server";
<<<<<<< HEAD
            if (error instanceof AxiosError) message = error?.response?.data?.message;
=======
            if (error instanceof AxiosError)
                message = error?.response?.data?.message;
>>>>>>> 81bdef25041d8e55d92e72bb2f7950aeeb7b8a46
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return chatType === "chats" ? (
<<<<<<< HEAD
        <Item name={name} _id={_id} chatType={chatType} chatId={chatId} />
    ) : (
        <ContextMenu>
            <ContextMenuTrigger>
                <Item name={name} _id={_id} chatType={chatType} chatId={chatId} />
=======
        <Item
            _id={_id}
            chatType={chatType}
            chatId={chatId}
            name={name}
            lastMessage={lastMessage}
            lastMessageTime={lastMessageTime}
            unreadCount={unreadCount}
        />
    ) : (
        <ContextMenu>
            <ContextMenuTrigger>
                <Item
                    _id={_id}
                    chatType={chatType}
                    chatId={chatId}
                    name={name}
                    lastMessage={lastMessage}
                    lastMessageTime={lastMessageTime}
                    unreadCount={unreadCount}
                />
>>>>>>> 81bdef25041d8e55d92e72bb2f7950aeeb7b8a46
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={removeFromGroup} disabled={loading}>
                    Remove from group
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}

<<<<<<< HEAD
function Item({ _id, name }: ChatItemProps) {
=======
function Item({
    _id,
    name,
    lastMessage,
    lastMessageTime,
    unreadCount,
}: ChatItemProps) {
>>>>>>> 81bdef25041d8e55d92e72bb2f7950aeeb7b8a46
    const updateSearchParam = useUpdateSearchParam();
    const [searchParams] = useSearchParams();

    return (
        <div
<<<<<<< HEAD
            className="data-[active=true]:bg-selected-chat hover:bg-chat-hover my-2 flex cursor-pointer items-center gap-4 rounded-md p-3"
            data-active={searchParams.get("open") === _id}
            onClick={() => updateSearchParam("open", _id)}
        >
            <UserCircle strokeWidth="1" className="size-8 rounded-full text-neutral-500" />
            <p className="font-semibold">{name}</p>
=======
            className="data-[active=true]:bg-selected-chat hover:bg-chat-hover my-2 flex cursor-pointer items-center justify-between rounded-md p-3"
            data-active={searchParams.get("open") === _id}
            onClick={() => updateSearchParam("open", _id)}
        >
            {/* Left Section - Avatar + Name + Last Message */}
            <div className="flex items-center gap-4 overflow-hidden">
                <UserCircle
                    strokeWidth="1"
                    className="size-8 rounded-full text-neutral-500"
                />
                <div className="flex flex-col overflow-hidden">
                    <p className="font-semibold truncate">{name}</p>
                    <p className="text-sm text-gray-500 truncate max-w-[200px]">
                        {lastMessage || ""}
                    </p>
                </div>
            </div>

            {/* Right Section - Time + Unread Badge */}
            <div className="flex flex-col items-end ml-2">
                <span className="text-xs text-gray-400">
                    {lastMessageTime || ""}
                </span>

                {unreadCount && unreadCount > 0 ? (
                    <span className="mt-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {unreadCount}
                    </span>
                ) : (
                    <span className="mt-1 min-h-[20px]"></span>
                )}
            </div>
>>>>>>> 81bdef25041d8e55d92e72bb2f7950aeeb7b8a46
        </div>
    );
}
