import { useEffect, useState } from "react";
import { File, Forward } from "lucide-react";

import { cn, fetchMetadata, readableFileSize, readableTime } from "@/lib";
import { MessageOptions } from "./message-options";
import { Checkbox } from "@/components";
import { useStore } from "@/store";

type DocumentMessageProps = {
    date: string;
    message?: string;
    messageId: string;
    sentBy: string;
    mediaUrl: string | null;
    type: string;
    isForwarded: boolean;
    replyTo: string;
};

export function DocumentMessage({ date, isForwarded, mediaUrl, messageId, replyTo, sentBy, message }: DocumentMessageProps) {
    const [meta, setMeta] = useState({
        type: "",
        size: "",
        name: ""
    });

    const toggleSelectedMessage = useStore((state) => state.toggleSelectedMessage);
    const selectMessageToggle = useStore((state) => state.selectMessageToggle);
    const selectedMessages = useStore((state) => state.selectedMessages);

    const messageSelected = selectedMessages.includes(messageId);

    useEffect(() => {
        if (!mediaUrl) return;

        fetchMetadata(mediaUrl).then((meta) => {
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
                <Checkbox checked={messageSelected} onCheckedChange={() => toggleSelectedMessage(messageId)} />
            ) : null}
            <div
                className={cn(
                    "relative my-2 w-10/12 max-w-xs rounded-md p-2 shadow-md",
                    sentBy === "admin" ? "bg-message-sent-by-me ml-auto" : "bg-message-sent-by-user"
                )}
            >
                {isForwarded ? (
                    <div className="mb-2 flex items-center gap-x-2 text-xs text-neutral-400">
                        <Forward className="size-4" />
                        <span>Forwarded</span>
                    </div>
                ) : null}
                <div className={cn("mb-2.5 rounded-md px-2 py-3", sentBy === "admin" ? "bg-primary/20" : "bg-neutral-500/20")}>
                    {mediaUrl ? (
                        <a href={mediaUrl} download target="_blank">
                            <div className="rounded-md">
                                <div className="flex items-center gap-x-2">
                                    <File className="size-8 shrink-0 whitespace-nowrap" />
                                    <div>
                                        <p className="text-sm">{meta.name}</p>
                                        <p className="text-xs text-neutral-300">{meta.size}</p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    ) : null}
                </div>
                <p>{message}</p>
                <div className="flex items-center justify-end">
                    <p className="text-xs text-neutral-400">{readableTime(date)}</p>
                </div>
                <MessageOptions textToCopy={message} sentBy={sentBy} messageId={messageId} messageType="document" />
            </div>
        </div>
    );
}
