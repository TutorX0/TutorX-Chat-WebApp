import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";

import { DocumentMessage } from "./message-box/document";
import { FileList } from "../send-message/file-list";
import { PhotoMessage } from "./message-box/photos";
import { TextMessage } from "./message-box/text";
import { socketData, type ChatMessage } from "@/validations";
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
    const pushMessage = useStore((state) => state.pushMessage);
    const moveChatToTop = useStore((state) => state.moveChatToTop);

    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;
        socket.on("newMessage", (data) => {
            const parsedResponse = socketData.safeParse(data);
            if (!parsedResponse.success) return toast.error("Invalid data type sent from server");

            const chatId = parsedResponse.data.chatId;
            const newMessage: ChatMessage = {
                _id: parsedResponse.data.chatId,
                createdAt: parsedResponse.data.timestamp,
                fileName: parsedResponse.data.fileName,
                mediaUrl: parsedResponse.data.mediaUrl,
                sender: parsedResponse.data.sender,
                type: parsedResponse.data.messageType,
                content: parsedResponse.data.content,
                replyTo: parsedResponse.data.replyTo,
                isForwarded: parsedResponse.data.isForwarded
            };

            pushMessage(chatId, newMessage);
            moveChatToTop(parsedResponse.data.phoneNumber);
        });

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
                ? Object.keys(messages).map((days, index) => (
                      <section key={`Chat-${index + 1}`}>
                          <div className="sticky top-0 z-50 flex justify-center">
                              <div className="bg-message-sent-by-user rounded-md border px-2 py-1 text-xs">{days}</div>
                          </div>
                          {messages[days].map((message) => {
                              if (message.type === "text")
                                  return (
                                      <TextMessage
                                          key={message._id}
                                          date={message.createdAt}
                                          message={message.content}
                                          messageId={message._id}
                                          sentBy={message.sender}
                                          isForwarded={message.isForwarded}
                                      />
                                  );
                              else if (message.type === "image" || message.type === "video")
                                  return (
                                      <PhotoMessage
                                          key={message._id}
                                          date={message.createdAt}
                                          message={message.content}
                                          messageId={message._id}
                                          sentBy={message.sender}
                                          mediaUrl={message.mediaUrl}
                                          type={message.type}
                                          isForwarded={message.isForwarded}
                                      />
                                  );
                              else if (message.type === "document")
                                  return (
                                      <DocumentMessage
                                          key={message._id}
                                          date={message.createdAt}
                                          message={message.content}
                                          messageId={message._id}
                                          sentBy={message.sender}
                                          mediaUrl={message.mediaUrl}
                                          type={message.type}
                                          isForwarded={message.isForwarded}
                                      />
                                  );
                          })}
                      </section>
                  ))
                : null}
            <div ref={scrollToBottomRef} className="pt-3"></div>
        </ScrollArea>
    );
}
