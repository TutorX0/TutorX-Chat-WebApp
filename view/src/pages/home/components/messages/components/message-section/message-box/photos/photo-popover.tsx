import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
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
            <DialogContent className="flex max-h-[80vh] !w-full !max-w-[80vw] items-center justify-center">
                {type === "image" ? (
                    <TransformWrapper>
                        <TransformComponent wrapperStyle={{ width: "100%" }}>
                            <img
                                src={mediaUrl}
                                alt="A random WhatsApp image"
                                className="max-h-[75vh] object-contain"
                                loading="lazy"
                            />
                        </TransformComponent>
                    </TransformWrapper>
                ) : type === "video" ? (
                    <video src={mediaUrl} className="max-h-[75vh] w-full object-contain" controls />
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
