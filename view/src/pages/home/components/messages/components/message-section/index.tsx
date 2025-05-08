import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";

import { FileList } from "../send-message/file-list";
import { PhotoMessage } from "./message-box/photos";
import { TextMessage } from "./message-box/text";
import { ScrollArea } from "@/components";
import { useSocket } from "@/context";
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
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;
        socket.on("newMessage", (data) => console.log(data));

        return () => {
            socket.off("newMessage");
        };
    });

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
                ? Object.keys(messages).map((days) => {
                      return messages[days].map((message) => {
                          if (message.type === "text")
                              return (
                                  <TextMessage
                                      key={message._id}
                                      date={message.createdAt}
                                      message={message.content}
                                      messageId={message._id}
                                      sentBy={message.sender}
                                  />
                              );
                          else if (message.type === "image") return <PhotoMessage
                          key={message._id}
                          date={message.createdAt}
                          message={message.content}
                          messageId={message._id}
                          sentBy={message.sender}
                          mediaUrl={message.mediaUrl}
                      />
                      });
                  })
                : null}
            <div ref={scrollToBottomRef} className="pt-3"></div>
        </ScrollArea>
    );
}
