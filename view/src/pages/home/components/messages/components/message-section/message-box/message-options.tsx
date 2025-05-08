import { ChevronDown, Copy, Forward, ListChecks, Reply } from "lucide-react";
import { useState } from "react";

import { Button, Popover, PopoverContent, PopoverTrigger } from "@/components";
import { useStore } from "@/store";
import { cn } from "@/lib";

type ContextProps = {
    messageId: string;
    sentBy: string;
    textToCopy?: string;
    messageType: string;
};

export function MessageOptions({ messageId, messageType, sentBy, textToCopy }: ContextProps) {
    const [open, setOpen] = useState(false);

    const setSelectMessageToggle = useStore((state) => state.setSelectMessageToggle);
    const setReplyMessage = useStore((state) => state.setReplyMessage);

    function copyToClipboard() {
        if (!textToCopy) return;
        window.navigator.clipboard.writeText(textToCopy);
        setOpen(false);
    }

    function toggleSelect() {
        setSelectMessageToggle(true);
        setOpen(false);
    }

    function toggleReply() {
        setReplyMessage({ content: textToCopy, messageId, sentBy: sentBy === "admin" ? "You" : "User", messageType });
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
                        sentBy === "admin" ? "-left-10" : "-right-10"
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
                <div className="flex cursor-pointer items-center gap-2">
                    <Forward className="size-5" />
                    <span className="text-sm">Forward</span>
                </div>
                <div className="flex cursor-pointer items-center gap-2" onClick={toggleSelect}>
                    <ListChecks className="size-5" />
                    <span className="text-sm">Select</span>
                </div>
            </PopoverContent>
        </Popover>
    );
}
