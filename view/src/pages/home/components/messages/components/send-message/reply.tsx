import { FileIcon, ImageIcon, VideoIcon, X } from "lucide-react";

import type { Reply as ReplyType } from "@/validations";
import { Button } from "@/components";
import { useStore } from "@/store";

type Props = {
    replyMessage: ReplyType;
};

export const Reply = ({ replyMessage }: Props) => {
    const setReplyMessage = useStore((state) => state.setReplyMessage);

    return (
        <div className="bg-message-input flex items-center gap-1 rounded-t-2xl p-2">
            <div className="flex-1 rounded-lg bg-[#1d1e1e] p-2">
                <p className="text-xs text-[#06cf9c]">{replyMessage.sender}</p>
                {replyMessage.mediaType === "text" ? (
                    <p className="line-clamp-1 text-sm">{replyMessage.content}</p>
                ) : replyMessage.mediaType === "image" ? (
                    <ReplyType Icon={ImageIcon} title="Image" />
                ) : replyMessage.mediaType === "video" ? (
                    <ReplyType Icon={VideoIcon} title="Video" />
                ) : replyMessage.mediaType === "document" ? (
                    <ReplyType Icon={FileIcon} title="File" />
                ) : null}
            </div>
            <Button size="icon" variant="secondary" onClick={() => setReplyMessage(null)}>
                <X />
            </Button>
        </div>
    );
};

function ReplyType({ Icon, title }: { Icon: any; title: string }) {
    return (
        <div className="mt-1 flex items-center gap-x-2 text-neutral-400">
            <Icon className="size-5" />
            <span>{title}</span>
        </div>
    );
}
