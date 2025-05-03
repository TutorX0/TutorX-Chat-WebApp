import { useRef, useState, type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import { Search } from "lucide-react";

import { Input, ScrollArea } from "@/components";
import { useUpdateSearchParam } from "@/hooks";
import { cn } from "@/lib";

const options = ["Profile", "Account"];

type ProfileSidebarProps = {
    currentTab: string | null;
    isResponsive?: boolean;
    setOpen?: Dispatch<SetStateAction<boolean>>;
};

export function ProfileSidebar({ currentTab, setOpen, isResponsive = false }: ProfileSidebarProps) {
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [search, setSearch] = useState("");

    const updateSearchParam = useUpdateSearchParam();

    let timeoutId = useRef<NodeJS.Timeout | null>(null);

    function onSearch(e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setSearch(value);

        if (timeoutId.current) clearTimeout(timeoutId.current);

        timeoutId.current = setTimeout(() => {
            console.log("Should not be running");
            if (!value) setFilteredOptions(options);
            else {
                setFilteredOptions(() => {
                    return options.filter((item) => item.toLowerCase().includes(value.toLowerCase()));
                });
            }
        }, 500);
    }

    function optionClick(option: string) {
        updateSearchParam("tab", option.toLowerCase());
        setOpen?.(false);
    }

    return (
        <aside className={cn("bg-sidebar flex grow flex-col gap-4 border", isResponsive ? "pt-12" : "pt-5")}>
            <div className="relative px-4">
                <Search className="absolute top-1/2 left-7 size-4 -translate-y-1/2 text-neutral-500" />
                <Input
                    type="text"
                    placeholder="Search ...."
                    className="focus-visible:ring-empty-input-border bg-empty-input focus-visible:bg-sidebar rounded-full pl-9 focus-visible:ring-1"
                    autoFocus
                    value={search}
                    onChange={onSearch}
                />
            </div>
            <ScrollArea className="h-[70vh] grow px-5 pb-4">
                {filteredOptions.map((option) => (
                    <div
                        key={`Profile-Option-${option}`}
                        className="data-[active=true]:bg-selected-chat hover:bg-chat-hover flex cursor-pointer items-center gap-4 rounded-md p-3"
                        data-active={currentTab === option.toLowerCase()}
                        onClick={() => optionClick(option)}
                    >
                        {option}
                    </div>
                ))}
            </ScrollArea>
        </aside>
    );
}
