import { File, Forward, Check, CheckCheck, Clock, OctagonAlert } from "lucide-react";
import { useEffect, useState } from "react";

import { cn, fetchMetadata, readableFileSize, readableTime } from "@/lib";
import { MessageOptions } from "./message-options";
import type { ChatMessage } from "@/validations";
import { Checkbox } from "@/components";
import { ReplyBox } from "./reply-box";
import { useStore } from "@/store";

type DocumentMessageProps = {
    message: ChatMessage;
    isAudio?: boolean;
};

export function DocumentMessage({ message, isAudio = false }: DocumentMessageProps) {
    const [meta, setMeta] = useState({
        type: "",
        size: "",
        name: ""
    });

    const toggleSelectedMessage = useStore((state) => state.toggleSelectedMessage);
    const selectMessageToggle = useStore((state) => state.selectMessageToggle);
    const selectedMessages = useStore((state) => state.selectedMessages);

    const messageSelected = selectedMessages.find((selectedMessage) => selectedMessage.id === message._id);

    function onCheckedChange() {
        toggleSelectedMessage({ content: message.content, id: message._id, mediaUrl: message.mediaUrl, type: message.type });
    }

    useEffect(() => {
        if (!message.mediaUrl) return;

        fetchMetadata(message.mediaUrl, message.fileName).then((meta) => {
            setMeta({ type: meta.type ?? "", name: meta.name, size: readableFileSize(meta.size) });
        });
    }, []);

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

                <div
                    className={cn(
                        "mb-2.5 overflow-hidden rounded-md px-2 py-3",
                        message.sender === "admin" ? "bg-primary/20" : "bg-neutral-500/20"
                    )}
                >
                    {message.mediaUrl ? (
                        <a href={message.mediaUrl} download={message.fileName ?? message.mediaUrl} target="_blank">
                            <div className="rounded-md">
                                <div className="flex items-center gap-x-2">
                                    <File className="size-8 shrink-0 whitespace-nowrap" />
                                    <div>
                                        {isAudio ? (
                                            <p className="text-sm">WhatsApp recorded audio</p>
                                        ) : (
                                            <p className="text-sm">{meta.name}</p>
                                        )}
                                        <p className="text-xs text-neutral-300">{meta.size}</p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    ) : null}
                </div>

                <p className="wrap-break-word">{message.content}</p>

                {/* ✅ FIXED: Time + WhatsApp ticks */}
                <div className="mt-1 flex items-center justify-end gap-1">
                    <p className="text-xs text-neutral-400">{readableTime(message.createdAt)}</p>

                    {message.sender === "admin" && (
                        <>
                            {message.status === "failed" && (
                                <OctagonAlert className="w-4 h-4 text-neutral-400 ml-1" />
                            )}
                            {message.status === "pending" && (
                                <Clock className="w-4 h-4 text-neutral-400 ml-1" />
                            )}
                            {message.status === "sent" && (
                                <Check className="w-4 h-4 text-neutral-400 ml-1" />
                            )}
                            {message.status === "delivered" && (
                                <CheckCheck className="w-4 h-4 text-neutral-400 ml-1" />
                            )}
                            {message.status === "read" && (
                                <CheckCheck className="w-4 h-4 text-blue-500 ml-1" />
                            )}
                        </>
                    )}
                </div>

                <MessageOptions message={message} messageType="document" />
            </div>
        </div>
    );
}
