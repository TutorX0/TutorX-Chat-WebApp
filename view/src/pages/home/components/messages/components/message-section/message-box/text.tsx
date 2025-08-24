import { Forward, Check, CheckCheck } from "lucide-react"; // ✅ added tick icons
import { useState } from "react";

import type { ChatMessage } from "@/validations";
import { MessageOptions } from "./message-options";
import { cn, readableTime } from "@/lib";
import { Checkbox } from "@/components";
import { ReplyBox } from "./reply-box";
import { useStore } from "@/store";

type TextMessageProps = {
    message: ChatMessage;
};

export function TextMessage({ message }: TextMessageProps) {
    const toggleSelectedMessage = useStore((state) => state.toggleSelectedMessage);
    const selectMessageToggle = useStore((state) => state.selectMessageToggle);
    const selectedMessages = useStore((state) => state.selectedMessages);

    const messageSelected = selectedMessages.find((selectedMessage) => selectedMessage.id === message._id);

    const [isExpanded, setIsExpanded] = useState(false);

    const fullContent = message.content ?? "";
    const charLimit = 700;

    const isLong = fullContent.length > charLimit;
    const previewContent = fullContent.slice(0, charLimit);

    const displayedContent = isExpanded || !isLong ? fullContent : previewContent;
    const displayedLines = displayedContent.split("\n");

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
                <div>
                    {displayedLines.map((line, index) => (
                        <p key={`${message._id}-line-${index + 1}`}>{line.trim() === "" ? "\u00A0" : line}</p>
                    ))}
                    {isLong ? (
                        <span onClick={() => setIsExpanded((prev) => !prev)} className="cursor-pointer text-sm text-blue-400">
                            {isExpanded ? "Read less" : "Read more"}
                        </span>
                    ) : null}
                </div>

                {/* ✅ Time + Tick section */}
                <div className="mt-1 flex items-center justify-end gap-1">
                    {/* Time */}
                    <p className="text-xs text-neutral-400">{readableTime(message.createdAt)}</p>

                    {/* ✅ WhatsApp-style ticks (only for admin/user-sent messages) */}
                    {message.sender === "admin" && (
                        <>
                            {message.status === "pending" && (
                                <Check className="w-4 h-4 text-neutral-400 ml-1" /> // single gray tick
                            )}
                            {message.status === "sent" && (
                                <Check className="w-4 h-4 text-neutral-400 ml-1" /> // single gray tick (sent)
                            )}
                            {message.status === "delivered" && (
                                <CheckCheck className="w-4 h-4 text-neutral-400 ml-1" /> // double gray ticks
                            )}
                            {message.status === "seen" && (
                                <CheckCheck className="w-4 h-4 text-blue-500 ml-1" /> // double blue ticks
                            )}
                        </>
                    )}
                </div>

                <MessageOptions message={message} messageType="text" />
            </div>
        </div>
    );
}
