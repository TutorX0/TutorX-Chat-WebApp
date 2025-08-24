import { UserCircle } from "lucide-react";

import { ScrollArea, Sheet, SheetContent, SheetTrigger } from "@/components";
import { UpdateChatName } from "./update-chat-name";
import type { ChatItem } from "@/store/validations";
import { Medias } from "./medias";

export function AboutThisChat({ chatId, phoneNumber, name }: Pick<ChatItem, "phoneNumber" | "name" | "chatId">) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <div className="flex cursor-pointer items-center gap-4">
                    <div>
                        <UserCircle strokeWidth="1" className="size-8 rounded-full text-neutral-500" />
                    </div>
                    <p className="cursor-pointer font-semibold">{name}</p>
                </div>
            </SheetTrigger>
            <SheetContent className="w-10/12 py-8 pl-4">
                <ScrollArea className="h-full pr-4">
                    <UpdateChatName name={name} phoneNumber={phoneNumber} />
                    <Medias chatId={chatId} />
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
