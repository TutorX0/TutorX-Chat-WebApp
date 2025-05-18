import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { ChevronDown } from "lucide-react";

import { DocumentMessage } from "./message-box/document";
import { FileList } from "../send-message/file-list";
import { PhotoMessage } from "./message-box/photos";
import { Button, ScrollArea } from "@/components";
import { TextMessage } from "./message-box/text";
import { useStore } from "@/store";
import { cn } from "@/lib";

type MessageSectionProps = {
    chatId: string;
    files: File[];
    setFiles: Dispatch<SetStateAction<File[]>>;
    phoneNumber: string;
};

export function MessageSection({ chatId, files, setFiles, phoneNumber }: MessageSectionProps) {
    const [showScrollButton, setShowScrollButton] = useState(false);

    const scrollToBottomRef = useRef<HTMLDivElement>(null);
    const scrollSectionRef = useRef<HTMLElement>(null);

    const fetchMessages = useStore((state) => state.fetchMessages);
    const replyMessage = useStore((state) => state.replyMessage);
    const messages = useStore((state) => state.messages)[chatId];

    useEffect(() => {
        if (!scrollToBottomRef.current) return;

        const observer = new IntersectionObserver(([entry]) => setShowScrollButton(!entry.isIntersecting), { threshold: 0 });
        observer.observe(scrollToBottomRef.current);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        fetchMessages(chatId);
    }, [chatId]);

    useEffect(() => {
        if (scrollToBottomRef.current) scrollToBottomRef.current.scrollIntoView();
    }, [messages]);

    function scrollIntoView() {
        if (!scrollToBottomRef.current) return;
        scrollToBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }

    return (
        <ScrollArea className="relative h-[70vh] grow px-4 pb-0">
            <section ref={scrollSectionRef} className="h-full overflow-y-auto pr-4" style={{ maxHeight: "100%" }}>
                <div className="pt-3"></div> {/* Just to create some separation from the header */}
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
                {showScrollButton ? (
                    <Button
                        variant="secondary"
                        size="icon"
                        className={cn("fixed right-8 rounded-full", replyMessage ? "bottom-36" : "bottom-20")}
                        onClick={scrollIntoView}
                    >
                        <ChevronDown />
                    </Button>
                ) : null}
            </section>
        </ScrollArea>
    );
}
