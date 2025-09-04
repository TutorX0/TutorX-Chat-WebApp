import { Search } from "lucide-react";
import { useState } from "react";

import { useFetchChats, useFetchGroups } from "@/hooks";
import { ChatItems } from "./chat-items";
import { Input } from "@/components";
import { useStore } from "@/store";
import { Pills } from "./pills";

export function ChatSidebar() {
    const [search, setSearch] = useState("");

    const { loading } = useFetchChats();
    useFetchGroups();

    const groups = useStore((state) => state.groups);
    const chats = useStore((state) => state.chats);

    const pillTitles = ["Chats", "Templates", ...(groups ? groups.map((group) => group.groupName) : [])];

    return (
        <aside className="bg-sidebar flex grow flex-col gap-4 border pt-5">
            <div className="relative px-4">
                <Search className="absolute top-1/2 left-7 size-4 -translate-y-1/2 text-neutral-500" />
                <Input
                    type="text"
                    placeholder="Search ...."
                    className="focus-visible:ring-empty-input-border bg-empty-input focus-visible:bg-sidebar rounded-full pl-9 focus-visible:ring-1"
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <Pills pillTitles={pillTitles} />
            <ChatItems chats={chats} loading={loading} search={search} />
        </aside>
    );
}
