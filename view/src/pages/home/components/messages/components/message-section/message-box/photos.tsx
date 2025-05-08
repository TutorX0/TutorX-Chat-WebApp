import { MessageOptions } from "./message-options";
import { cn, readableTime } from "@/lib";
import { Checkbox } from "@/components";
import logo from "@/assets/logo.webp";
import { useStore } from "@/store";

type PhotoMessageProps = {
    date: string;
    message?: string;
    messageId: string;
    sentBy: string;
    mediaUrl: string | null;
};

export function PhotoMessage({ date, mediaUrl, messageId, sentBy, message }: PhotoMessageProps) {
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
                {mediaUrl ?
                <div className="mb-2.5 rounded-md bg-neutral-300 p-3">
                    <img src={mediaUrl} alt="A random WhatsApp image" className="size-full" loading="lazy" />
                </div> : <div>no media url</div>}
                <p>
                    {message}
                </p>
                <div className="flex items-center justify-end">
                    <p className="text-xs text-neutral-400">{readableTime(date)}</p>
                </div>
                <MessageOptions textToCopy={message} sentBy={sentBy} messageId={messageId} />
            </div>
        </div>
    );
}
