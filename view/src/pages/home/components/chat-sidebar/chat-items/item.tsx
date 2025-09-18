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
import { whatsappTime } from "@/lib";

type ChatItemProps = Pick<
  ChatItemType,
  "_id" | "name" | "lastMessage" | "unreadCount"
> & {
  chatType: string | null;
  chatId: string;
};

export function ChatItem({
  _id,
  chatId,
  chatType,
  name,
  lastMessage,
  unreadCount,
}: ChatItemProps) {
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
      if (!parsedResponse.success) {
        return toast.error("Invalid data type sent from server");
      }

      addGroup(parsedResponse.data.group);
      toast.success(response.data.message);
    } catch (error: unknown) {
      let message = "An unexpected error was returned from the server";
      if (error instanceof AxiosError) {
        message = error?.response?.data?.message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  // ✅ treat only group types as ContextMenu
  const isGroup =
    chatType !== null && chatType !== "chats" && chatType !== "templates";

  // 🔍 Debug log
  console.log(
    `🔍 ChatItem Render → chatType: ${chatType}, isGroup: ${isGroup}, chatId: ${chatId}`
  );

  if (!isGroup) {
    // ✅ home (null), chats, templates → normal item
    return (
      <Item
        name={name}
        _id={_id}
        chatType={chatType}
        chatId={chatId}
        lastMessage={lastMessage}
        unreadCount={unreadCount}
      />
    );
  }

  // ✅ only groups (like czsc) → context menu
  return (
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

  const displayName = name?.trim()
    ? name
    : chatId
    ? `+${chatId.slice(-10)}`
    : "Unknown";

  const handleClick = () => {
    resetUnread(chatId);
    axiosClient.patch(`/chat/${chatId}/reset-unread`);
    updateSearchParam("open", _id);
  };

  // 🔹 helper to truncate last message
  const truncateMessage = (msg: string, maxLength = 25) => {
    if (!msg) return "[Media Message]";
    return msg.length > maxLength ? msg.slice(0, maxLength) + "..." : msg;
  };

  return (
    <div
      className="data-[active=true]:bg-selected-chat hover:bg-chat-hover my-2 flex min-w-0 cursor-pointer items-center gap-4 rounded-md p-3 overflow-hidden"
      data-active={searchParams.get("open") === _id}
      onClick={handleClick}
    >
      <UserCircle
        strokeWidth="1"
        className="size-8 shrink-0 rounded-full text-neutral-500"
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {lastMessage ? (
          <>
            {/* Top row */}
            <div className="flex items-center justify-between w-full min-w-0 overflow-hidden">
              <p className="font-semibold truncate min-w-0 max-w-[65%]">
                {displayName}
              </p>
              <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
                <p className="text-xs text-neutral-400">
                  {lastMessage?.timestamp ? whatsappTime(lastMessage.timestamp) : ""}
                </p>
                {Number(unreadCount) > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom row */}
            <div className="flex items-center w-full min-w-0 overflow-hidden">
              <p className="flex-1 min-w-0 text-sm text-neutral-500 leading-tight">
                {truncateMessage(lastMessage?.content || "")}
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm text-neutral-400 italic">No messages yet</p>
        )}
      </div>
    </div>
  );
}
