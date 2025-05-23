import { useMemo } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components";
import { MediaFile, MediaImageAndVideos } from "./files";
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
                            mediaUrl ? <MediaImageAndVideos _id={_id} mediaUrl={mediaUrl} type={type} /> : null
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
