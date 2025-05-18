import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { ChatNotSelected } from "./components/chat-not-selected";
import { MessageSection } from "./components/message-section";
import { MessageHeader } from "./components/message-header";
import { SendMessage } from "./components/send-message";
import { useDeleteSearchParam } from "@/hooks";
import type { ChatItem } from "@/validations";
import { useStore } from "@/store";

export function Messages() {
    const [files, setFiles] = useState<File[]>([]);

    const [searchParams] = useSearchParams();
    const deleteSearchParam = useDeleteSearchParam();
    const openedChat = searchParams.get("open");

    const chats = useStore((state) => state.chats);
    let currentChat: ChatItem | undefined;
    if (openedChat) currentChat = chats.find((chat) => chat._id === openedChat);

    useEffect(() => {
        if (!chats.length) return;
        if (openedChat && !currentChat) {
            deleteSearchParam("open");
        }
    }, [openedChat, currentChat, chats]);

    if (!openedChat || !currentChat) return <ChatNotSelected />;

    return (
        <section className="flex grow flex-col">
            <MessageHeader currentChat={currentChat} />
            <div className="after:bg-sidebar/90 relative isolate flex grow flex-col bg-[url(/chat-bg.png)] after:absolute after:inset-0 after:-z-10">
                <MessageSection
                    files={files}
                    setFiles={setFiles}
                    chatId={currentChat.chatId}
                    phoneNumber={currentChat.phoneNumber}
                />
                <SendMessage setFiles={setFiles} phoneNumber={currentChat.phoneNumber} />
            </div>
        </section>
    );
}
