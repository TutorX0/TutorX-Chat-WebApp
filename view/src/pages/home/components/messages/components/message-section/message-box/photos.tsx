import { useState } from "react";

import { MessageOptions } from "./message-options";
import { cn, readableTime } from "@/lib";
import { Checkbox } from "@/components";
import { useStore } from "@/store";
import { Forward } from "lucide-react";

type PhotoMessageProps = {
    date: string;
    message?: string;
    messageId: string;
    sentBy: string;
    mediaUrl: string | null;
    type: string;
    isForwarded: boolean;
    replyTo: string;
};

export function PhotoMessage({ date, isForwarded, mediaUrl, messageId, sentBy, message, type }: PhotoMessageProps) {
    const [showControls, setShowControls] = useState(false);

    const toggleSelectedMessage = useStore((state) => state.toggleSelectedMessage);
    const selectMessageToggle = useStore((state) => state.selectMessageToggle);
    const selectedMessages = useStore((state) => state.selectedMessages);

    const messageSelected = selectedMessages.includes(messageId);

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
                    "relative my-2 w-10/12 max-w-xs rounded-md p-3 shadow-md",
                    sentBy === "admin" ? "bg-message-sent-by-me ml-auto" : "bg-message-sent-by-user"
                )}
            >
                {isForwarded ? (
                    <div className="mb-2 flex items-center gap-x-2 text-xs text-neutral-400">
                        <Forward className="size-4" />
                        <span>Forwarded</span>
                    </div>
                ) : null}
                {mediaUrl ? (
                    <div className="mb-2.5 rounded-md bg-neutral-300 p-3">
                        {type === "image" ? (
                            <img src={mediaUrl} alt="A random WhatsApp image" className="size-full" loading="lazy" />
                        ) : type === "video" ? (
                            <video
                                src={mediaUrl}
                                className="size-full"
                                onMouseEnter={() => setShowControls(true)}
                                onMouseLeave={() => setShowControls(false)}
                                controls={showControls}
                            />
                        ) : null}
                    </div>
                ) : null}
                <p>{message}</p>
                <div className="flex items-center justify-end">
                    <p className="text-xs text-neutral-400">{readableTime(date)}</p>
                </div>
                <MessageOptions textToCopy={message} sentBy={sentBy} messageId={messageId} messageType={type} />
            </div>
        </div>
    );
}
