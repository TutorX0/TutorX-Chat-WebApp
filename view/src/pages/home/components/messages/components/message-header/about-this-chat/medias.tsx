import { File } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components";
import type { MessageRecord } from "@/store/messages";
import type { ChatMessage } from "@/validations";
import { useStore } from "@/store";
import { fetchMetadata, readableFileSize } from "@/lib";

function filterMessagesByTypes(data: MessageRecord, types: string[]) {
    const result: ChatMessage[] = [];

    Object.values(data).forEach((category) => {
        Object.values(category).forEach((messages) => {
            messages.forEach((message) => {
                if (types.includes(message.type)) {
                    result.push(message);
                }
            });
        });
    });

    return result;
}

export function Medias() {
    const messages = useStore((state) => state.messages);

    const mediaFiles = useMemo(() => filterMessagesByTypes(messages, ["image", "video"]), [messages]);

    const documentFiles = useMemo(() => filterMessagesByTypes(messages, ["document"]), [messages]);

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
                <div className="mx-4 my-4 grid grid-cols-2 gap-4">
                    {mediaFiles.map(({ _id, mediaUrl, type }) =>
                        mediaUrl ? (
                            <div key={`Media-${_id}`}>
                                {type === "image" ? (
                                    <img src={mediaUrl} alt="A random WhatsApp image" className="size-full" loading="lazy" />
                                ) : type === "video" ? (
                                    <video src={mediaUrl} className="size-full" controls />
                                ) : null}
                            </div>
                        ) : null
                    )}
                </div>
            </TabsContent>
            <TabsContent value="docs">
                <div className="mx-4 my-4 flex flex-col gap-4">
                    {documentFiles.map(({ mediaUrl }) => (mediaUrl ? <MediaFile mediaUrl={mediaUrl} /> : null))}
                </div>
            </TabsContent>
        </Tabs>
    );
}

function MediaFile({ mediaUrl }: { mediaUrl: string }) {
    const [meta, setMeta] = useState({
        type: "",
        size: "",
        name: ""
    });

    useEffect(() => {
        if (!mediaUrl) return;

        fetchMetadata(mediaUrl).then((meta) => {
            setMeta({ type: meta.type ?? "", name: meta.name, size: readableFileSize(meta.size) });
        });
    }, []);

    return (
        <a href={mediaUrl} download target="_blank">
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
