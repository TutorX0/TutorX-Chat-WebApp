import { useSearchParams } from "react-router-dom";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components";
import { ChatSidebar } from "./components/chat-sidebar";
import { Messages } from "./components/messages";
import type { ChatItem } from "@/validations";
import { Header } from "./components/header";
import { useStore } from "@/store";
import { cn } from "@/lib";

export default function HomePage() {
    const [searchParams] = useSearchParams();
    const openedChat = searchParams.get("open");

    const chats = useStore((state) => state.chats);
    let currentChat: ChatItem | undefined;
    if (openedChat) currentChat = chats.find((chat) => chat._id === openedChat);

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex grow flex-col">
                <ResizablePanelGroup direction="horizontal" className="grow">
                    <ResizablePanel
                        maxSize={50}
                        minSize={20}
                        defaultSize={30}
                        className={cn("flex-col", currentChat ? "hidden md:flex" : "flex")}
                    >
                        <ChatSidebar />
                    </ResizablePanel>
                    <ResizableHandle withHandle className="hidden flex-col md:flex" />
                    <ResizablePanel className={cn("flex-col", currentChat ? "flex" : "hidden md:flex")}>
                        <Messages />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </main>
        </div>
    );
}
