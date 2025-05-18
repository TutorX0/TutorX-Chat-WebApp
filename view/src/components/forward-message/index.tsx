import { useState, type PropsWithChildren } from "react";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components";
import type { SelectedMessage } from "@/store/select-messages";
import { Button, Checkbox, ScrollArea } from "@/components";
import { useStore } from "@/store";
import { axiosClient } from "@/lib";
import { AxiosError } from "axios";
import { toast } from "sonner";

type ForwardMessageProps = PropsWithChildren<{
    messages: SelectedMessage[];
}>;

export function ForwardMessage({ messages, children }: ForwardMessageProps) {
    const [selectedPhoneNumbers, setSelectedPhoneNumbers] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const setSelectMessageToggle = useStore((state) => state.setSelectMessageToggle);
    const chats = useStore((state) => state.chats);

    function handleSelectChat(currentChatPhoneNumber: string) {
        if (loading) return;
        else if (selectedPhoneNumbers.includes(currentChatPhoneNumber))
            setSelectedPhoneNumbers((prev) => prev.filter((phoneNumber) => phoneNumber !== currentChatPhoneNumber));
        else setSelectedPhoneNumbers((prev) => [...prev, currentChatPhoneNumber]);
    }

    function resetForwarding() {
        setSelectedPhoneNumbers([]);
        setOpen(false);
    }

    async function forwardMessages() {
        if (!messages.length || !selectedPhoneNumbers.length || loading) return;

        setLoading(true);
        try {
            await axiosClient.post("/chat/forward", { phoneNumbers: selectedPhoneNumbers, messages });
            setSelectedPhoneNumbers([]);
            setSelectMessageToggle(false);
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
                            onClick={() => handleSelectChat(chat.phoneNumber)}
                        >
                            <p>{chat.name}</p>
                            <Checkbox checked={selectedPhoneNumbers.includes(chat.phoneNumber)} />
                        </div>
                    ))}
                </ScrollArea>
                <DialogFooter className="z-10 flex items-center justify-between gap-x-4">
                    <Button variant="outline" className="rounded-full" onClick={resetForwarding}>
                        Cancel
                    </Button>
                    <Button variant="secondary" className="rounded-full" loading={loading} onClick={forwardMessages}>
                        Forward
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
