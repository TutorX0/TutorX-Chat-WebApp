import { useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import { Send } from "lucide-react";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { textMessageResponseSchema } from "@/validations";
import { AutosizeTextarea, Button } from "@/components";
import { FileMessage } from "./file-message";
import { axiosClient, cn } from "@/lib";
import { useStore } from "@/store";
import { Emoji } from "./emoji";
import { Reply } from "./reply";

type SendMessageProps = {
    phoneNumber: string;
    setFiles: Dispatch<SetStateAction<File[]>>;
};

export function SendMessage({ phoneNumber, setFiles }: SendMessageProps) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const replyMessage = useStore((state) => state.replyMessage);

    async function sendTextMessage(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (loading || message.length < 1) return;

        setLoading(true);
        try {
            const response = await axiosClient.post("/chat/send", { phoneNumber, message });

            const parsedResponse = textMessageResponseSchema.safeParse(response.data);
            if (!parsedResponse.success) return toast.error("Invalid data type sent from server");

            setMessage("");
        } catch (error: unknown) {
            let message = "An unexpected error was returned from the server";
            if (error instanceof AxiosError) message = error?.response?.data?.message;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevents newline
            sendTextMessage(e as unknown as FormEvent<HTMLFormElement>);
        }
    };

    return (
        <section className="px-4 pb-3">
            {replyMessage ? <Reply replyMessage={replyMessage} /> : null}
            <div
                className={cn(
                    "bg-message-input flex items-end overflow-y-auto rounded-b-4xl px-2 pt-1 pb-2",
                    replyMessage ? "" : "rounded-t-4xl"
                )}
            >
                <Emoji setMessage={setMessage} />
                <FileMessage setFiles={setFiles} />
                <form onSubmit={sendTextMessage} className="flex flex-1 items-end gap-2">
                    <AutosizeTextarea
                        className="bg-message-input border-message-input outline-message-input ring-message-input ring-offset-message-input focus-visible:border-message-input focus-visible:outline-message-input focus-visible:ring-message-input focus-visible:ring-offset-message-input custom-scroll resize-none"
                        placeholder="Type a message"
                        minHeight={10}
                        maxHeight={108}
                        autoFocus
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={onKeyDown}
                    />
                    <Button type="submit" variant="secondary" size="icon" className="hover:bg-input-buttons-hover rounded-full">
                        <Send />
                    </Button>
                </form>
            </div>
        </section>
    );
}
