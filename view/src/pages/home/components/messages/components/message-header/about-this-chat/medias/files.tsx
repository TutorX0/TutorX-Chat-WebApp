import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { FileIcon, PlayIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components";
import { fetchMetadata, readableFileSize } from "@/lib";

type MediaImageAndVideosProps = {
    _id: string;
    type: string;
    mediaUrl: string;
};

export function MediaImageAndVideos({ _id, mediaUrl, type }: MediaImageAndVideosProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div key={`Media-${_id}`} className="flex items-center justify-center rounded-md bg-neutral-800">
                    {type === "image" ? (
                        <img
                            src={mediaUrl}
                            alt="A random WhatsApp image"
                            className="h-40 w-full cursor-pointer rounded-md object-cover"
                            loading="lazy"
                        />
                    ) : type === "video" ? (
                        <div className="relative isolate cursor-pointer before:absolute before:inset-0 before:bg-black/30">
                            <video src={mediaUrl} className="h-40 w-full rounded-md object-contain" />
                            <div className="absolute top-1/2 left-1/2 -translate-1/2 rounded-full border bg-white/20 p-4">
                                <PlayIcon className="size-6 stroke-3" />
                            </div>
                        </div>
                    ) : null}
                </div>
            </DialogTrigger>
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

type MediaFileProps = {
    mediaUrl: string;
    fileName: string | null;
};

export function MediaFile({ mediaUrl, fileName }: MediaFileProps) {
    const [meta, setMeta] = useState({
        type: "",
        size: "",
        name: ""
    });

    useEffect(() => {
        if (!mediaUrl) return;

        fetchMetadata(mediaUrl, fileName).then((meta) => {
            setMeta({ type: meta.type ?? "", name: meta.name, size: readableFileSize(meta.size) });
        });
    }, []);

    return (
        <a href={mediaUrl} download={fileName ?? mediaUrl} target="_blank" className="overflow-hidden">
            <div className="rounded-md">
                <div className="flex items-center gap-x-2">
                    <FileIcon className="size-8 shrink-0 whitespace-nowrap text-neutral-400" />
                    <div>
                        <p className="text-sm">{meta.name}</p>
                        <p className="text-xs text-neutral-400">{meta.size}</p>
                    </div>
                </div>
            </div>
        </a>
    );
}
