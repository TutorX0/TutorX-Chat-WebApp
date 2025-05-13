import type { PropsWithChildren } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components";

type PhotoPopover = PropsWithChildren<{
    mediaUrl: string;
    fileName: string | null;
    type: string;
}>;

export function PhotoPopover({ fileName, mediaUrl, type, children }: PhotoPopover) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="h-[80vh] w-full max-w-[80vw]">
                {type === "image" ? (
                    <img src={mediaUrl} alt="A random WhatsApp image" className="size-full object-contain" loading="lazy" />
                ) : type === "video" ? (
                    <video src={mediaUrl} className="size-full object-contain" controls />
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
