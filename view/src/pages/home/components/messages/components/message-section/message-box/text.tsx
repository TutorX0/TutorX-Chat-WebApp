import { Forward } from "lucide-react";

import type { ChatMessage } from "@/validations";
import { MessageOptions } from "./message-options";
import { cn, readableTime } from "@/lib";
import { Checkbox } from "@/components";
import { ReplyBox } from "./reply-box";
import { useStore } from "@/store";

type TextMessageProps = {
    message: ChatMessage;
};

<<<<<<< HEAD
export function TextMessage({ date, isForwarded, messageId, sentBy, message }: TextMessageProps) {
=======
export function TextMessage({ message }: TextMessageProps) {
>>>>>>> 91ce848152bf726b4cc0eb42f331ccdfee25830c
    const toggleSelectedMessage = useStore((state) => state.toggleSelectedMessage);
    const selectMessageToggle = useStore((state) => state.selectMessageToggle);
    const selectedMessages = useStore((state) => state.selectedMessages);

    const messageSelected = selectedMessages.find((selectedMessage) => selectedMessage.id === message._id);

    function onCheckedChange() {
        toggleSelectedMessage({ content: message.content, id: message._id, mediaUrl: message.mediaUrl, type: message.type });
    }

    return (
        <div
            className={cn(
                "group flex items-center gap-x-4",
                selectMessageToggle ? "hover:bg-neutral-400/5" : "",
                messageSelected ? "bg-message-sent-by-me/40 hover:bg-message-sent-by-me/40" : ""
            )}
        >
            {selectMessageToggle ? <Checkbox checked={messageSelected ? true : false} onCheckedChange={onCheckedChange} /> : null}
            <div
                className={cn(
                    "relative my-2 w-fit max-w-10/12 rounded-md px-2 py-1.5 shadow-md lg:max-w-2/3",
                    message.sender === "admin" ? "bg-message-sent-by-me ml-auto" : "bg-message-sent-by-user"
                )}
            >
                <ReplyBox replyTo={message.replyTo} />
                {message.isForwarded ? (
                    <div className="mb-1 flex items-center gap-x-2 text-xs text-neutral-400">
                        <Forward className="size-4" />
                        <span>Forwarded</span>
                    </div>
                ) : null}
                <p>{message.content}</p>
                <div className="mt-1 flex items-center justify-end">
                    <p className="text-xs text-neutral-400">{readableTime(message.createdAt)}</p>
                </div>
                <MessageOptions message={message} messageType="text" />
            </div>
        </div>
    );
}
