import { FileIcon, ImageIcon, VideoIcon, type LucideIcon } from "lucide-react";
import type { Reply } from "@/validations";

export function ReplyBox({ replyTo }: { replyTo: Reply | null }) {
  if (!replyTo) return null;

  return (
    <div className="mb-1 flex-1 rounded bg-[#0d3325] px-2 py-1.5">
      <p className="text-xs text-[#06cf9c] capitalize">{replyTo.sender}</p>

      {replyTo.type === "text" ? (
        <p className="line-clamp-1 text-xs text-neutral-300">{replyTo.content}</p>
      ) : replyTo.type === "image" ? (
        <ReplyMedia Icon={ImageIcon} title="Image" />
      ) : replyTo.type === "video" ? (
        <ReplyMedia Icon={VideoIcon} title="Video" />
      ) : replyTo.type === "document" ? (
        <ReplyMedia Icon={FileIcon} title="File" />
      ) : null}
    </div>
  );
}

function ReplyMedia({ Icon, title }: { Icon: LucideIcon; title: string }) {
  return (
    <div className="mt-1 flex items-center gap-x-2 text-neutral-400">
      <Icon className="size-4" />
      <span className="text-sm">{title}</span>
    </div>
  );
}
