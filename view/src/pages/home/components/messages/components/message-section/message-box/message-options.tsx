import { ChevronDown, Copy, Forward, ListChecks, Reply } from "lucide-react";
import { useState } from "react";

import { Button, ForwardMessage, Popover, PopoverContent, PopoverTrigger } from "@/components";
import type { ChatMessage } from "@/validations";
import { useStore } from "@/store";
import { cn } from "@/lib";

type ContextProps = {
    message: ChatMessage;
    messageType: string;
};

export function MessageOptions({ message, messageType }: ContextProps) {
    const [open, setOpen] = useState(false);

    const setSelectMessageToggle = useStore((state) => state.setSelectMessageToggle);
    const setReplyMessage = useStore((state) => state.setReplyMessage);

    function copyToClipboard() {
        if (!message.content) return;
        window.navigator.clipboard.writeText(message.content);
        setOpen(false);
    }

    function toggleSelect() {
        setSelectMessageToggle(true);
        setOpen(false);
    }

    function toggleReply() {
        setReplyMessage({
            content: message.content,
            mediaType: message.type,
            sender: message.sender
        });
        setOpen(false);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                        "invisible absolute top-1/2 -translate-y-1/2 rounded-full p-4 group-hover:visible hover:visible",
                        message.sender === "admin" ? "-left-10" : "-right-10"
                    )}
                >
                    <ChevronDown className="size-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="text-options w-full space-y-3">
                <div className="flex cursor-pointer items-center gap-2" onClick={toggleReply}>
                    <Reply className="size-5" />
                    <span className="text-sm">Reply</span>
                </div>
                <div className="flex cursor-pointer items-center gap-2" onClick={copyToClipboard}>
                    <Copy className="size-5" />
                    <span className="text-sm">Copy</span>
                </div>
                <ForwardMessage
                    messages={[{ content: message.content, id: message._id, mediaUrl: message.mediaUrl, type: messageType }]}
                >
                    <div className="flex cursor-pointer items-center gap-2">
                        <Forward className="size-5" />
                        <span className="text-sm">Forward</span>
                    </div>
                </ForwardMessage>
                <div className="flex cursor-pointer items-center gap-2" onClick={toggleSelect}>
                    <ListChecks className="size-5" />
                    <span className="text-sm">Select</span>
                </div>
            </PopoverContent>
        </Popover>
    );
}
