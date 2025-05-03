import { Plus } from "lucide-react";
import { useState } from "react";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components";
import { Button, Checkbox, Input, ScrollArea } from "@/components";
import { useStore } from "@/store";

export function AddPill() {
    const [selectedChats, setSelectedChats] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const chats = useStore((state) => state.chats);

    function handleSelectChat(currentChatId: string) {
        if (loading) return;
        else if (selectedChats.includes(currentChatId)) setSelectedChats((prev) => prev.filter((item) => item !== currentChatId));
        else setSelectedChats((prev) => [...prev, currentChatId]);
    }

    function createNewGroup() {
        if (loading) return;
        setLoading(true);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="bg-secondary/30 border-secondary flex-1 shrink-0 cursor-pointer rounded-full border px-3 py-1">
                    <Plus className="size-3.5" />
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New List</DialogTitle>
                </DialogHeader>
                <div>
                    <Input placeholder="Example: Work, Friends" autoFocus />
                    <p className="mt-4 mb-2 text-center sm:text-left">Add to list</p>
                    <ScrollArea className="h-full max-h-[40vh] pr-3">
                        {chats.map((chat) => (
                            <div
                                key={`Select-chat-id-${chat._id}`}
                                className="my-2 flex cursor-pointer items-start justify-between gap-x-4 rounded-md border px-4 py-3"
                                onClick={() => handleSelectChat(chat._id)}
                            >
                                <p>{chat.name}</p>
                                <Checkbox checked={selectedChats.includes(chat._id)} />
                            </div>
                        ))}
                    </ScrollArea>
                </div>
                <DialogFooter className="z-10">
                    <Button loading={loading} onClick={createNewGroup}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
