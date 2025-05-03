import { ChevronDown, Copy, Forward, Reply } from "lucide-react";
import { useState } from "react";

import { Button, Popover, PopoverContent, PopoverTrigger } from "@/components";
import { cn } from "@/lib";

type ContextProps = {
    sentBy: string;
    textToCopy: string;
};

export function MessageOptions({ sentBy, textToCopy }: ContextProps) {
    const [open, setOpen] = useState(false);

    function copyToClipboard() {
        window.navigator.clipboard.writeText(textToCopy);
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
                <div className="flex cursor-pointer items-center gap-2">
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
            </PopoverContent>
        </Popover>
    );
}
