import type { Dispatch, SetStateAction } from "react";
import { Smile } from "lucide-react";

import { Button, Popover, PopoverContent, PopoverTrigger } from "@/components";
import { Picker } from "./picker";

type EmojiProps = {
    setMessage: Dispatch<SetStateAction<string>>;
};

export function Emoji({ setMessage }: EmojiProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="secondary" size="icon" className="hover:bg-input-buttons-hover mb-0.5 rounded-full">
                    <Smile />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-full max-w-sm p-0">
                <Picker setMessage={setMessage} />
            </PopoverContent>
        </Popover>
    );
}
