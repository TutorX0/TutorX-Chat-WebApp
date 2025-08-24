import { Forward, PlayIcon } from "lucide-react";

import { MessageOptions } from "../message-options";
import type { ChatMessage } from "@/store/validations";
import { PhotoPopover } from "./photo-popover";
import { cn, readableTime } from "@/lib";
import { Checkbox } from "@/components";
import { ReplyBox } from "../reply-box";
import { useStore } from "@/store";

type PhotoMessageProps = {
    message: ChatMessage;
};

export function PhotoMessage({ message }: PhotoMessageProps) {
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
            {selectMessageToggle ? (
                <Checkbox
                    checked={messageSelected ? true : false}
                    onCheckedChange={onCheckedChange}
                    className="border-neutral-400"
                />
            ) : null}
            <div
                className={cn(
                    "relative my-2 w-10/12 max-w-xs rounded-md shadow-md",
                    message.sender === "admin" ? "bg-message-sent-by-me ml-auto" : "bg-message-sent-by-user",
                    message.content ? "p-2" : ""
                )}
            >
                <ReplyBox replyTo={message.replyTo} />
                {message.isForwarded ? (
                    <div
                        className={cn(
                            "flex items-center gap-x-2 text-xs text-neutral-400",
                            message.content ? "mb-2" : "mx-2 my-1"
                        )}
                    >
                        <Forward className="size-4" />
                        <span>Forwarded</span>
                    </div>
                ) : null}
                {message.mediaUrl ? (
                    <PhotoPopover mediaUrl={message.mediaUrl} type={message.type}>
                        <div className={cn("flex items-center justify-center rounded-md bg-neutral-400 p-2")}>
                            {message.type === "image" ? (
                                <img
                                    src={message.mediaUrl}
                                    alt="A random WhatsApp image"
                                    className="max-h-96 w-full cursor-pointer rounded-md object-contain"
                                    loading="lazy"
                                />
                            ) : message.type === "video" ? (
                                <div className="relative isolate cursor-pointer before:absolute before:inset-0 before:bg-black/50">
                                    <video
                                        src={message.mediaUrl}
                                        className="max-h-96 w-full rounded-md object-contain"
                                        controls={false}
                                    />
                                    <div className="absolute top-1/2 left-1/2 -translate-1/2 rounded-full border bg-white/20 p-4">
                                        <PlayIcon className="size-6 stroke-3" />
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </PhotoPopover>
                ) : null}
                <p className="wrap-break-word">{message.content}</p>
                <div className="m-1 flex items-center justify-end">
                    <p className="text-xs text-neutral-400">{readableTime(message.createdAt)}</p>
                </div>
                <MessageOptions message={message} messageType={message.type} />
            </div>
        </div>
    );
}
