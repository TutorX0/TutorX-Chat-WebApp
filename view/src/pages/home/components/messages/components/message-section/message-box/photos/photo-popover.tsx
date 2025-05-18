import type { PropsWithChildren } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components";

type PhotoPopover = PropsWithChildren<{
    mediaUrl: string;
    type: string;
}>;

export function PhotoPopover({ mediaUrl, type, children }: PhotoPopover) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="flex h-[80vh] w-full max-w-[80vw] items-center justify-center">
                {type === "image" ? (
                    <img src={mediaUrl} alt="A random WhatsApp image" className="max-h-[75vh] object-contain" loading="lazy" />
                ) : type === "video" ? (
                    <video src={mediaUrl} className="max-h-[75vh] object-contain" controls />
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
