import { MessageOptions } from "./message-options";
import { cn, readableTime } from "@/lib";
import { Checkbox } from "@/components";
import { useStore } from "@/store";
import { Forward } from "lucide-react";

type TextMessageProps = {
    date: string;
    message?: string;
    messageId: string;
    sentBy: string;
    isForwarded: boolean;
    replyTo: string;
};

export function TextMessage({ date, isForwarded, messageId, replyTo, sentBy, message }: TextMessageProps) {
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
                    "relative my-2 w-fit max-w-10/12 rounded-md p-3 shadow-md lg:max-w-2/3",
                    sentBy === "admin" ? "bg-message-sent-by-me ml-auto" : "bg-message-sent-by-user"
                )}
            >
                {isForwarded ? (
                    <div className="mb-1 flex items-center gap-x-2 text-xs text-neutral-400">
                        <Forward className="size-4" />
                        <span>Forwarded</span>
                    </div>
                ) : null}
                <p>{message}</p>
                <div className="mt-1 flex items-center justify-end">
                    <p className="text-xs text-neutral-400">{readableTime(date)}</p>
                </div>
                <MessageOptions textToCopy={message} sentBy={sentBy} messageId={messageId} messageType="text" />
            </div>
        </div>
    );
}
