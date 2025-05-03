import { X } from "lucide-react";

import { AboutThisChat } from "./about-this-chat";
import { useDeleteSearchParam } from "@/hooks";
import type { ChatItem } from "@/validations";
import { Button } from "@/components";

type MessageHeaderProps = {
    currentChat: ChatItem;
};

export function MessageHeader({ currentChat }: MessageHeaderProps) {
    const deleteSearchParam = useDeleteSearchParam();

    return (
        <section className="bg-sidebar flex items-center justify-between px-4 py-2">
            <AboutThisChat name={currentChat.name} phoneNumber={currentChat.phoneNumber} />
            <div>
                <Button size="icon" variant="outline" className="rounded-full" onClick={() => deleteSearchParam("open")}>
                    <X className="size-4" />
                </Button>
            </div>
        </section>
    );
}
