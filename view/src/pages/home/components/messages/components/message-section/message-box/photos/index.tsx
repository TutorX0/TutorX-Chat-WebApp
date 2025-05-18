import { Forward } from "lucide-react";
import { useState } from "react";

import { MessageOptions } from "../message-options";
import type { ChatMessage } from "@/validations";
import { PhotoPopover } from "./photo-popover";
import { cn, readableTime } from "@/lib";
import { Checkbox } from "@/components";
import { ReplyBox } from "../reply-box";
import { useStore } from "@/store";

type PhotoMessageProps = {
    message: ChatMessage;
};

export function PhotoMessage({ message }: PhotoMessageProps) {
    const [showControls, setShowControls] = useState(false);

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
                    "relative my-2 w-10/12 max-w-xs rounded-md px-2 py-1.5 shadow-md",
                    message.sender === "admin" ? "bg-message-sent-by-me ml-auto" : "bg-message-sent-by-user"
                )}
            >
                <ReplyBox replyTo={message.replyTo} />
                {message.isForwarded ? (
                    <div className="mb-2 flex items-center gap-x-2 text-xs text-neutral-400">
                        <Forward className="size-4" />
                        <span>Forwarded</span>
                    </div>
                ) : null}
                {message.mediaUrl ? (
                    <PhotoPopover mediaUrl={message.mediaUrl} type={message.type}>
                        <div className="mb-2.5 flex items-center justify-center rounded-md bg-neutral-300 p-3">
                            {message.type === "image" ? (
                                <img
                                    src={message.mediaUrl}
                                    alt="A random WhatsApp image"
                                    className="max-h-96 object-contain"
                                    loading="lazy"
                                />
                            ) : message.type === "video" ? (
                                <video
                                    src={message.mediaUrl}
                                    className="max-h-96 object-contain"
                                    onMouseEnter={() => setShowControls(true)}
                                    onMouseLeave={() => setShowControls(false)}
                                    controls={showControls}
                                />
                            ) : null}
                        </div>
                    </PhotoPopover>
                ) : null}
                <p>{message.content}</p>
                <div className="flex items-center justify-end">
                    <p className="text-xs text-neutral-400">{readableTime(message.createdAt)}</p>
                </div>
                <MessageOptions message={message} messageType={message.type} />
            </div>
        </div>
    );
}
