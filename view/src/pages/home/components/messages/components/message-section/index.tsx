import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";

import { FileList } from "../send-message/file-list";
import { TextMessage } from "./message-box/text";
import { ScrollArea } from "@/components";
import { useStore } from "@/store";

type MessageSectionProps = {
    chatId: string;
    files: File[];
    setFiles: Dispatch<SetStateAction<File[]>>;
    phoneNumber: string;
};

export function MessageSection({ chatId, files, setFiles, phoneNumber }: MessageSectionProps) {
    const scrollToBottomRef = useRef<HTMLDivElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const loaderRef = useRef<HTMLDivElement>(null);

    const messages = useStore((state) => state.messages)[chatId];
    const hasMore = useStore((state) => state.hasMore)[chatId];
    const fetchMessages = useStore((state) => state.fetchMessages);
    // const loadMoreMessages = useStore((state) => state.loadMoreMessages);

    useEffect(() => {
        fetchMessages(chatId);
    }, [chatId]);

    // useEffect(() => {
    //     if (!loaderRef.current || !scrollAreaRef.current) return;

    //     const observer = new IntersectionObserver(
    //         async (entries) => {
    //             const entry = entries[0];
    //             if (entry.isIntersecting && hasMore) {
    //                 if (!scrollAreaRef.current) return;
    //                 const prev_height = scrollAreaRef.current.scrollHeight;

    //                 loadMoreMessages(chatId);

    //                 // Maintain scroll position after new messages are prepended
    //                 requestAnimationFrame(() => {
    //                     if (!scrollAreaRef.current) return;
    //                     const new_height = scrollAreaRef.current.scrollHeight;
    //                     scrollAreaRef.current.scrollTop = new_height - prev_height;
    //                 });
    //             }
    //         },
    //         { root: scrollAreaRef.current, threshold: 0.1 }
    //     );

    //     observer.observe(loaderRef.current);

    //     return () => {
    //         observer.disconnect();
    //     };
    // }, [hasMore]);

    useEffect(() => {
        if (scrollToBottomRef.current && messages?.length > 0) scrollToBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <ScrollArea ref={scrollAreaRef} className="relative h-[70vh] grow p-4 pb-0">
            <FileList files={files} setFiles={setFiles} phoneNumber={phoneNumber} />
            {/* {hasMore ? (
                <div
                    ref={loaderRef}
                    className="mx-auto mb-4 size-12 animate-spin rounded-full border-8 border-indigo-700 border-t-transparent"
                ></div>
            ) : null} */}
            {messages?.map((message) => {
                return message.messageType === "text" ? (
                    <TextMessage key={message._id} sentBy={message.sender} message={message.content} date={message.createdAt} />
                ) : null;
            })}
            <div ref={scrollToBottomRef} className="pt-3"></div>
        </ScrollArea>
    );
}
