import { useState, type PropsWithChildren } from "react";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components";
import { Button, Checkbox, ScrollArea } from "@/components";
import { useStore } from "@/store";

export function ForwardMessage({ children }: PropsWithChildren) {
    const [selectedChats, setSelectedChats] = useState<string[]>([]);
    const [loading] = useState(false);
    const [open, setOpen] = useState(false);

    const chats = useStore((state) => state.chats);
   

    function handleSelectChat(currentChatId: string) {
        if (loading) return;
        else if (selectedChats.includes(currentChatId)) setSelectedChats((prev) => prev.filter((item) => item !== currentChatId));
        else setSelectedChats((prev) => [...prev, currentChatId]);
    }

    function resetForwarding() {
        setSelectedChats([]);
        setOpen(false);
    }

    async function forwardMessages() {
        // for (const chatId of selectedChats) {
        //     for (const messageId of selectedMessages) {
        //         const message = messages;
        //     }
        // }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Forward to ....</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-full max-h-[40vh] pr-3">
                    {chats.map((chat) => (
                        <div
                            key={`Select-chat-id-${chat._id}`}
                            className="my-2 flex cursor-pointer items-start justify-between gap-x-4 rounded-md border px-4 py-3"
                            onClick={() => handleSelectChat(chat.chatId)}
                        >
                            <p>{chat.name}</p>
                            <Checkbox checked={selectedChats.includes(chat.chatId)} />
                        </div>
                    ))}
                </ScrollArea>
                <DialogFooter className="z-10 flex items-center justify-between gap-x-4">
                    <Button variant="secondary" onClick={resetForwarding}>
                        Cancel
                    </Button>
                    <Button loading={loading} onClick={forwardMessages}>
                        Forward
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
