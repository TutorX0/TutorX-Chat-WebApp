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

    const messages = useStore((state) => state.messages)[chatId];
    const fetchMessages = useStore((state) => state.fetchMessages);

    useEffect(() => {
        fetchMessages(chatId);
    }, [chatId]);

    useEffect(() => {
        if (scrollToBottomRef.current) scrollToBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <ScrollArea ref={scrollAreaRef} className="relative h-[70vh] grow p-4 pb-0">
            <FileList files={files} setFiles={setFiles} phoneNumber={phoneNumber} />
            {messages
                ? Object.keys(messages).map((days) => {
                      return messages[days].map((message) => (
                          <TextMessage
                              key={message._id}
                              date={message.createdAt}
                              message={message.content}
                              sentBy={message.sender}
                          />
                      ));
                  })
                : null}
            <div ref={scrollToBottomRef} className="pt-3"></div>
        </ScrollArea>
    );
}
