import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";

import { DocumentMessage } from "./message-box/document";
import { FileList } from "../send-message/file-list";
import { PhotoMessage } from "./message-box/photos";
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
        if (scrollToBottomRef.current) scrollToBottomRef.current.scrollIntoView();
    }, [messages]);

    return (
        <ScrollArea ref={scrollAreaRef} className="relative h-[70vh] grow p-4 pb-0">
            <FileList files={files} setFiles={setFiles} phoneNumber={phoneNumber} />
            {messages
                ? Object.keys(messages).map((days, index) => (
                      <section key={`Chat-${index + 1}`}>
                          <div className="sticky top-0 z-50 flex justify-center">
                              <div className="bg-message-sent-by-user rounded-md border px-2 py-1 text-xs">{days}</div>
                          </div>
                          {messages[days].map((message) => {
                              const component = {
                                  text: <TextMessage key={message.createdAt} message={message} />,
                                  image: <PhotoMessage key={message.createdAt} message={message} />,
                                  video: <PhotoMessage key={message.createdAt} message={message} />,
                                  document: <DocumentMessage key={message.createdAt} message={message} />
                              };

                              return component[message.type as "text"];
                          })}
                      </section>
                  ))
                : null}
            <div ref={scrollToBottomRef} className="pt-3"></div>
        </ScrollArea>
    );
}
