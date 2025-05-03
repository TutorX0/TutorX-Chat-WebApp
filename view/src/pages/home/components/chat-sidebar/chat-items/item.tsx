import { useSearchParams } from "react-router-dom";
import { UserCircle } from "lucide-react";

import { useUpdateSearchParam } from "@/hooks";
import type { ChatItem } from "@/validations";

export function ChatItem({ name, _id }: Pick<ChatItem, "_id" | "name">) {
    const updateSearchParam = useUpdateSearchParam();
    const [searchParams] = useSearchParams();

    return (
        <div
            className="data-[active=true]:bg-selected-chat hover:bg-chat-hover flex cursor-pointer items-center gap-4 rounded-md p-3"
            data-active={searchParams.get("open") === _id}
            onClick={() => updateSearchParam("open", _id)}
        >
            <UserCircle strokeWidth="1" className="size-8 rounded-full text-neutral-500" />
            <p className="font-semibold">{name}</p>
        </div>
    );
}
