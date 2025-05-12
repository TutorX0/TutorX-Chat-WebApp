import { useEffect, useMemo, useState } from "react";
import { File } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components";
import { fetchMetadata, readableFileSize } from "@/lib";
import type { MessageRecord } from "@/store/messages";
import { useStore } from "@/store";

function getFilteredMessagesByType(data: MessageRecord, chatId: string, allowedTypes: string[]) {
    if (!data[chatId]) return [];
    const allMessages = Object.values(data[chatId]).flat();
    return allMessages.filter((msg) => allowedTypes.includes(msg.type));
}

type MediasProps = {
    chatId: string;
};

export function Medias({ chatId }: MediasProps) {
    const messages = useStore((state) => state.messages);

    const mediaFiles = useMemo(() => getFilteredMessagesByType(messages, chatId, ["image", "video"]), [messages, chatId]);
    const documentFiles = useMemo(() => getFilteredMessagesByType(messages, chatId, ["document"]), [messages, chatId]);

    return (
        <Tabs defaultValue="media" className="w-full">
            <TabsList className="h-full w-full bg-transparent p-0">
                <TabsTrigger
                    value="media"
                    className="data-[state=active]:text-primary data-[state=active]:border-b-primary cursor-pointer rounded-none border-2 pb-2"
                >
                    Media
                </TabsTrigger>
                <TabsTrigger
                    value="docs"
                    className="data-[state=active]:text-primary data-[state=active]:border-b-primary cursor-pointer rounded-none border-2 pb-2"
                >
                    Docs
                </TabsTrigger>
            </TabsList>
            <TabsContent value="media">
                <div className="m-4 grid grid-cols-2 gap-4">
                    {mediaFiles.length ? (
                        mediaFiles.map(({ _id, mediaUrl, type }) =>
                            mediaUrl ? (
                                <div key={`Media-${_id}`}>
                                    {type === "image" ? (
                                        <img src={mediaUrl} alt="A random WhatsApp image" className="size-full" loading="lazy" />
                                    ) : type === "video" ? (
                                        <video src={mediaUrl} className="size-full" controls />
                                    ) : null}
                                </div>
                            ) : null
                        )
                    ) : (
                        <p className="col-span-2 text-center text-neutral-400">There are no media files in this chat</p>
                    )}
                </div>
            </TabsContent>
            <TabsContent value="docs">
                <div className="m-4 grid gap-4">
                    {documentFiles.length ? (
                        documentFiles.map(({ mediaUrl, fileName }) =>
                            mediaUrl ? <MediaFile mediaUrl={mediaUrl} fileName={fileName} /> : null
                        )
                    ) : (
                        <p className="text-center text-neutral-400">There are no documents in this chat</p>
                    )}
                </div>
            </TabsContent>
        </Tabs>
    );
}

function MediaFile({ mediaUrl, fileName }: { mediaUrl: string; fileName: string | null }) {
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
                    <File className="size-8 shrink-0 whitespace-nowrap text-neutral-400" />
                    <div>
                        <p className="text-sm">{meta.name}</p>
                        <p className="text-xs text-neutral-400">{meta.size}</p>
                    </div>
                </div>
            </div>
        </a>
    );
}
