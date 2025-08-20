import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import { DocumentMessage } from "./message-box/document";
import { PhotoMessage } from "./message-box/photos";
import { Button, ScrollArea } from "@/components";
import { TextMessage } from "./message-box/text";
import { useStore } from "@/store";
import { cn } from "@/lib";

<<<<<<< HEAD
=======
// 🔊 import notification sound from assets
import notificationSound from "@/assets/incoming-message-online-whatsapp.mp3";  

// ✅ Strongly typed message
type Message = {
    _id: string;
    senderId: string;
    createdAt: string;
    type: "text" | "image" | "video" | "document" | "audio";
    content: string;
};

>>>>>>> 81bdef25041d8e55d92e72bb2f7950aeeb7b8a46
type MessageSectionProps = {
    chatId: string;
};

export function MessageSection({ chatId }: MessageSectionProps) {
    const [showScrollButton, setShowScrollButton] = useState(false);

    const scrollToBottomRef = useRef<HTMLDivElement>(null);
    const scrollSectionRef = useRef<HTMLElement>(null);

<<<<<<< HEAD
    const fetchMessages = useStore((state) => state.fetchMessages);
    const replyMessage = useStore((state) => state.replyMessage);
    const messages = useStore((state) => state.messages)[chatId];

    useEffect(() => {
        if (!scrollToBottomRef.current) return;

        const observer = new IntersectionObserver(([entry]) => setShowScrollButton(!entry.isIntersecting), { threshold: 0 });
=======
    // 🔊 audio setup only once
    const audioRef = useRef<HTMLAudioElement>(new Audio(notificationSound));
    const lastMessageId = useRef<string | null>(null);

    const fetchMessages = useStore((state) => state.fetchMessages);
    const replyMessage = useStore((state) => state.replyMessage);

    // ✅ direct type inference (no extra annotation needed)
    const messages = useStore((state) => state.messages[chatId]) as
        | Record<string, Message[]>
        | undefined;

    // 🔊 user id for checking sender
    const userId: string | undefined = useStore((state) => state.user?._id);

    // 👇 Show/hide scroll button
    useEffect(() => {
        if (!scrollToBottomRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => setShowScrollButton(!entry.isIntersecting),
            { threshold: 0 }
        );
>>>>>>> 81bdef25041d8e55d92e72bb2f7950aeeb7b8a46
        observer.observe(scrollToBottomRef.current);

        return () => observer.disconnect();
    }, []);

<<<<<<< HEAD
    useEffect(() => {
        fetchMessages(chatId);
    }, [chatId]);

    useEffect(() => {
        if (scrollToBottomRef.current) scrollToBottomRef.current.scrollIntoView();
    }, [messages]);

=======
    // 👇 Fetch messages when chatId changes
    useEffect(() => {
        fetchMessages(chatId);
    }, [chatId, fetchMessages]);

    // 👇 Auto scroll when messages update
    useEffect(() => {
        if (scrollToBottomRef.current) {
            scrollToBottomRef.current.scrollIntoView();
        }
    }, [messages]);

    // 🔊 Configure audio volume + cleanup
    useEffect(() => {
        audioRef.current.volume = 0.5;

        return () => {
            audioRef.current.src = ""; // cleanup
        };
    }, []);

    // 🔊 Play sound on new message
    useEffect(() => {
        if (!messages) return;

        const allMessages = Object.values(messages).flat();
        if (allMessages.length === 0) return;

        const latestMessage = allMessages[allMessages.length - 1];

        // first render ke liye baseline set karo
        if (!lastMessageId.current) {
            lastMessageId.current = latestMessage._id;
            return;
        }

        // ✅ only play for new incoming messages (not sent by self)
        if (lastMessageId.current !== latestMessage._id) {
            lastMessageId.current = latestMessage._id;

            if (latestMessage.senderId !== userId) {
                audioRef.current
                    .play()
                    .catch(() => console.warn("Sound blocked until user interaction"));
            }
        }
    }, [messages, userId]);

>>>>>>> 81bdef25041d8e55d92e72bb2f7950aeeb7b8a46
    function scrollIntoView() {
        if (!scrollToBottomRef.current) return;
        scrollToBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }

    return (
        <ScrollArea className="relative h-[70vh] grow px-4 pb-0">
<<<<<<< HEAD
            <section ref={scrollSectionRef} className="relative h-full" style={{ maxHeight: "100%" }}>
                <div className="pt-3"></div> {/* Just to create some separation from the header */}
                {messages
                    ? Object.keys(messages).map((days, index) => (
                        <section key={`Chat-${index + 1}`}>
                            <div className="sticky top-4 z-50 flex justify-center">
                                <div className="bg-message-sent-by-user rounded-md border px-2 py-1 text-xs">{days}</div>
                            </div>
                            {messages[days].map((message) => {
                                const component = {
                                    text: <TextMessage key={message.createdAt} message={message} />,
                                    image: <PhotoMessage key={message.createdAt} message={message} />,
                                    video: <PhotoMessage key={message.createdAt} message={message} />,
                                    document: <DocumentMessage key={message.createdAt} message={message} />,
                                    audio: <DocumentMessage key={message.createdAt} message={message} isAudio />
                                };

                                return component[message.type as "text"];
                            })}
                        </section>
                    ))
                    : null}
                <div ref={scrollToBottomRef} className="pt-3"></div>
=======
            <section
                ref={scrollSectionRef}
                className="relative h-full"
                style={{ maxHeight: "100%" }}
            >
                <div className="pt-3"></div>

                {messages
                    ? Object.keys(messages).map((days, index) => (
                          <section key={`Chat-${index + 1}`}>
                              <div className="sticky top-4 z-50 flex justify-center">
                                  <div className="bg-message-sent-by-user rounded-md border px-2 py-1 text-xs">
                                      {days}
                                  </div>
                              </div>

                              {messages[days].map((message) => {
                                  switch (message.type) {
                                      case "text":
                                          return (
                                              <TextMessage key={message._id} message={message} />
                                          );
                                      case "image":
                                      case "video":
                                          return (
                                              <PhotoMessage key={message._id} message={message} />
                                          );
                                      case "document":
                                          return (
                                              <DocumentMessage key={message._id} message={message} />
                                          );
                                      case "audio":
                                          return (
                                              <DocumentMessage
                                                  key={message._id}
                                                  message={message}
                                                  isAudio
                                              />
                                          );
                                      default: {
                                          // ✅ exhaustive check
                                          const _exhaustive: never = message.type;
                                          return null;
                                      }
                                  }
                              })}
                          </section>
                      ))
                    : null}

                <div ref={scrollToBottomRef} className="pt-3"></div>

>>>>>>> 81bdef25041d8e55d92e72bb2f7950aeeb7b8a46
                {showScrollButton ? (
                    <Button
                        variant="secondary"
                        size="icon"
<<<<<<< HEAD
                        className={cn("fixed right-4 rounded-full", replyMessage ? "bottom-36" : "bottom-20")}
=======
                        className={cn(
                            "fixed right-4 rounded-full",
                            replyMessage ? "bottom-36" : "bottom-20"
                        )}
>>>>>>> 81bdef25041d8e55d92e72bb2f7950aeeb7b8a46
                        onClick={scrollIntoView}
                    >
                        <ChevronDown />
                    </Button>
                ) : null}
            </section>
        </ScrollArea>
    );
}
