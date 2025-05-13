import { useSearchParams } from "react-router-dom";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { groupCreationResponseSchema } from "@/validations";
import {
    Button,
    Checkbox,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    ScrollArea
} from "@/components";
import { axiosClient } from "@/lib";
import { useStore } from "@/store";

type SelectChatsProps = {
    alreadyAddedChats: string[];
};

export function SelectChats({ alreadyAddedChats }: SelectChatsProps) {
    const [selectedChats, setSelectedChats] = useState<string[]>(alreadyAddedChats);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [searchParams] = useSearchParams();
    const chatType = searchParams.get("chat_type");

    const addGroup = useStore((state) => state.addGroup);
    const chats = useStore((state) => state.chats);

    useEffect(() => {
        setSelectedChats(alreadyAddedChats);
    }, [alreadyAddedChats]);

    function handleSelectChat(currentChatId: string) {
        if (loading) return;
        else if (selectedChats.includes(currentChatId)) setSelectedChats((prev) => prev.filter((item) => item !== currentChatId));
        else setSelectedChats((prev) => [...prev, currentChatId]);
    }

    async function addItemsToGroup() {
        if (!chatType) return;

        setLoading(true);
        try {
            const response = await axiosClient.patch("/group/add-user", { groupName: chatType, messageIds: selectedChats });

            const parsedResponse = groupCreationResponseSchema.safeParse(response.data);
            if (!parsedResponse.success) return toast.error("Invalid data type sent from server");

            addGroup(parsedResponse.data.group);
            toast.success(parsedResponse.data.message);
            setSelectedChats([]);
            setOpen(false);
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
                <Button>Add Members</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Members</DialogTitle>
                </DialogHeader>
                <div>
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
                    <Button loading={loading} onClick={addItemsToGroup}>
                        Add
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
