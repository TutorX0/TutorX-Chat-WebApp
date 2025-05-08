import { MessageOptions } from "./message-options";
import { cn, readableTime } from "@/lib";
import { Checkbox } from "@/components";
import { useStore } from "@/store";

type TextMessageProps = {
    date: string;
    message?: string;
    messageId: string;
    sentBy: string;
};

export function TextMessage({ date, message, messageId, sentBy }: TextMessageProps) {
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
                <p>{message}</p>
                <div className="mt-1 flex items-center justify-end">
                    <p className="text-xs text-neutral-400">{readableTime(date)}</p>
                </div>
                <MessageOptions textToCopy={message} sentBy={sentBy} messageId={messageId} />
            </div>
        </div>
    );
}
