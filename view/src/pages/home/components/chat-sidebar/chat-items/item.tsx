import { useSearchParams } from "react-router-dom";
import { UserCircle } from "lucide-react";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components";
import { groupCreationResponseSchema, type ChatItem } from "@/validations";
import { useUpdateSearchParam } from "@/hooks";
import { axiosClient } from "@/lib";
import { useStore } from "@/store";

type ChatItemProps = Pick<ChatItem, "_id" | "name"> & {
    chatType: string | null;
    chatId: string;
};

export function ChatItem({ _id, chatId, chatType, name }: ChatItemProps) {
    const [loading, setLoading] = useState(false);
    const addGroup = useStore((state) => state.addGroup);

    async function removeFromGroup() {
        if (loading) return;

        setLoading(true);
        try {
            const response = await axiosClient.put("/group/remove-users", { groupName: chatType, messageId: chatId });

            const parsedResponse = groupCreationResponseSchema.safeParse(response.data);
            if (!parsedResponse.success) return toast.error("Invalid data type sent from server");

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
        <Item name={name} _id={_id} chatType={chatType} chatId={chatId} />
    ) : (
        <ContextMenu>
            <ContextMenuTrigger>
                <Item name={name} _id={_id} chatType={chatType} chatId={chatId} />
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={removeFromGroup} disabled={loading}>
                    Remove from group
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}

function Item({ _id, name }: ChatItemProps) {
    const updateSearchParam = useUpdateSearchParam();
    const [searchParams] = useSearchParams();

    return (
        <div
            className="data-[active=true]:bg-selected-chat hover:bg-chat-hover flex cursor-pointer items-center gap-4 rounded-md p-3"
            data-active={searchParams.get("open") === _id}
            onClick={() => updateSearchParam("open", _id)}
        >
            <UserCircle strokeWidth="1" className="size-8 rounded-full text-neutral-500" />
            <p className="font-semibold">{name}</p>
        </div>
    );
}
