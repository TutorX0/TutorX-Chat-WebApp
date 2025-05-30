import { Forward, X } from "lucide-react";

import { Button, ForwardMessage } from "@/components";
import { AboutThisChat } from "./about-this-chat";
import { useDeleteSearchParam } from "@/hooks";
import type { ChatItem } from "@/validations";
import { useStore } from "@/store";

type MessageHeaderProps = {
    currentChat: ChatItem;
};

export function MessageHeader({ currentChat }: MessageHeaderProps) {
    const setSelectMessageToggle = useStore((state) => state.setSelectMessageToggle);
    const selectMessageToggle = useStore((state) => state.selectMessageToggle);
    const selectedMessages = useStore((state) => state.selectedMessages);

    const deleteSearchParam = useDeleteSearchParam();

    function closeMessageWindow() {
        deleteSearchParam("open");
        setSelectMessageToggle(false);
    }

    return (
        <section className="bg-sidebar flex items-center justify-between px-4 py-2">
            <AboutThisChat name={currentChat.name} phoneNumber={currentChat.phoneNumber} chatId={currentChat.chatId} />
            {selectMessageToggle ? (
                <div className="flex items-center gap-x-4">
                    <ForwardMessage messages={selectedMessages}>
                        <Button variant="secondary" size="icon" className="rounded-full">
                            <Forward />
                        </Button>
                    </ForwardMessage>
                    <Button variant="secondary" className="rounded-full" onClick={() => setSelectMessageToggle(false)}>
                        Cancel
                    </Button>
                </div>
            ) : (
                <div>
                    <Button size="icon" variant="outline" className="rounded-full" onClick={closeMessageWindow}>
                        <X className="size-4" />
                    </Button>
                </div>
            )}
        </section>
    );
}
