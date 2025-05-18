import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components";
import { Button, Checkbox, Input, ScrollArea } from "@/components";
import { groupCreationResponseSchema } from "@/validations";
import { useUpdateSearchParam } from "@/hooks";
import { axiosClient } from "@/lib";
import { useStore } from "@/store";

export function AddPill() {
    const [selectedChats, setSelectedChats] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const updateSearchParam = useUpdateSearchParam();

    const addGroup = useStore((state) => state.addGroup);
    const chats = useStore((state) => state.chats);

    const inputRef = useRef<HTMLInputElement>(null);

    function handleSelectChat(currentChatId: string) {
        if (loading) return;
        else if (selectedChats.includes(currentChatId)) setSelectedChats((prev) => prev.filter((item) => item !== currentChatId));
        else setSelectedChats((prev) => [...prev, currentChatId]);
    }

    async function createNewGroup() {
        if (loading || !inputRef.current?.value) return;
        const groupName = inputRef.current.value;

        setLoading(true);
        try {
            const response = await axiosClient.post("/group/addUsersToGroup", { groupName, messageIds: selectedChats });

            const parsedResponse = groupCreationResponseSchema.safeParse(response.data);
            if (!parsedResponse.success) return toast.error("Invalid data type sent from server");

            addGroup(parsedResponse.data.group);
            toast.success(parsedResponse.data.message);
            setOpen(false);
            setSelectedChats([]);
            updateSearchParam("chat_type", groupName);
        } catch (error: unknown) {
            let message = "An unexpected error was returned from the server";
            if (error instanceof AxiosError) message = error?.response?.data?.message;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="bg-secondary/30 border-secondary flex h-8 w-full min-w-16 flex-1 shrink-0 cursor-pointer items-center justify-center rounded-full border px-3 py-1">
                    <Plus className="size-3.5" />
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New List</DialogTitle>
                </DialogHeader>
                <div>
                    <Input placeholder="Example: Work, Friends" autoFocus ref={inputRef} />
                    <p className="mt-4 mb-2 text-center sm:text-left">Add to list</p>
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
                </div>
                <DialogFooter className="z-10">
                    <Button variant="secondary" className="rounded-full" loading={loading} onClick={createNewGroup}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
