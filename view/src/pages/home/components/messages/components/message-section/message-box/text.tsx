import { MessageOptions } from "./message-options";
import { cn, readableTime } from "@/lib";

type TextMessageProps = {
    sentBy: string;
    message: string;
    date: string;
};

export function TextMessage({ date, message, sentBy }: TextMessageProps) {
    return (
        <div className="group">
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
                <MessageOptions textToCopy={message} sentBy={sentBy} />
            </div>
        </div>
    );
}
