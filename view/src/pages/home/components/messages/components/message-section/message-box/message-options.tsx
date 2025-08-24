import { ChevronDown, Copy, DownloadIcon, Forward, ListChecks, Reply } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button, ForwardMessage, Popover, PopoverContent, PopoverTrigger } from "@/components";
import { cn, getExtensionFromMimeType } from "@/lib";
import type { ChatMessage } from "@/store/validations";
import { useStore } from "@/store";

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

    async function downloadMedia() {
        if (!message.mediaUrl) return;

        try {
            const response = await fetch(message.mediaUrl);

            if (!response.ok) {
                toast.error(`Failed to fetch image. Status: ${response.status}`);
                return;
            }

            const blob = await response.blob();
            const extension = getExtensionFromMimeType(blob.type);
            const fileName = `${message.fileName ?? "media-file"}${extension || ""}`;

            const blobUrl = URL.createObjectURL(blob);
            const anchor = document.createElement("a");

            anchor.href = blobUrl;
            anchor.download = fileName;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();

            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            toast.error("Image download failed");
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                        "absolute top-1/2 -translate-y-1/2 scale-75 rounded-full p-4 md:invisible md:group-hover:visible md:hover:visible",
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
                {["video", "image", "document", "audio"].includes(message.type) ? (
                    <div className="flex cursor-pointer items-center gap-2" onClick={downloadMedia}>
                        <DownloadIcon className="size-5" />
                        <span className="text-sm">Download</span>
                    </div>
                ) : null}
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
