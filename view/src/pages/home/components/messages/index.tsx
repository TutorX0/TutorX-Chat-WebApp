import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { ChatNotSelected } from "./components/chat-not-selected";
import { FileList } from "./components/send-message/file-list";
import { MessageSection } from "./components/message-section";
import { MessageHeader } from "./components/message-header";
import { SendMessage } from "./components/send-message";
import { useDeleteSearchParam } from "@/hooks";
import type { ChatItem } from "@/validations";
import type { UploadFile } from "@/types";
import { useStore } from "@/store";

export function Messages() {
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [fileDialogOpen, setFileDialogOpen] = useState(files.length > 0);

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
                <MessageSection chatId={currentChat.chatId} />
                <SendMessage
                    files={files}
                    setFiles={setFiles}
                    phoneNumber={currentChat.phoneNumber}
                    setFileDialogOpen={setFileDialogOpen}
                />
            </div>
            <FileList
                files={files}
                setFiles={setFiles}
                phoneNumber={currentChat.phoneNumber}
                open={fileDialogOpen}
                setOpen={setFileDialogOpen}
            />
        </section>
    );
}
