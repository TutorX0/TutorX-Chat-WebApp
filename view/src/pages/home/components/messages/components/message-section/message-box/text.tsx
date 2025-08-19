import { Forward } from "lucide-react";
import { useState } from "react";

import type { ChatMessage } from "@/validations";
import { MessageOptions } from "./message-options";
import { cn, readableTime } from "@/lib";
import { Checkbox } from "@/components";
import { ReplyBox } from "./reply-box";
import { useStore } from "@/store";

// ✅ TextMessage props type
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
                
                {/* ✅ Footer row where time + ticks show */}
                <div className="mt-1 flex items-center justify-end gap-x-1">
                    <p className="text-xs text-neutral-400">{readableTime(message.createdAt)}</p>

                    {/* 👈 CHANGE: Add ticks only for messages sent by me (admin) */}
                    {message.sender === "admin" && (
                        <span className="ml-1 text-xs">
                            {/* 👈 CHANGE: Status field expected from backend (same as WhatsApp API: "sent" | "delivered" | "read") */}
                            {message.status === "sent" && "✓"}
                            {message.status === "delivered" && "✓✓"}
                            {message.status === "read" && <span className="text-blue-500">✓✓</span>}
                        </span>
                    )}
                </div>

                <MessageOptions message={message} messageType="text" />
            </div>
        </div>
    );
}
