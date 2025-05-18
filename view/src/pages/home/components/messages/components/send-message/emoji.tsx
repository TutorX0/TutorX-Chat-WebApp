import { lazy, Suspense, type Dispatch, type SetStateAction } from "react";
import { Smile } from "lucide-react";
import data from "@emoji-mart/data";

import { Button, Popover, PopoverContent, PopoverTrigger, Skeleton } from "@/components";

const Picker = lazy(() => import("@emoji-mart/react"));

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
                <Suspense fallback={<Skeleton className="xs:w-sm h-[27.25rem] w-48" />}>
                    <Picker
                        data={data}
                        previewPosition="none"
                        dynamicWidth={window.innerWidth < 400}
                        perLine={window.innerWidth > 400 ? 9 : 5}
                        onEmojiSelect={(emoji: any) => setMessage((prev) => prev + emoji.native)}
                    />
                </Suspense>
            </PopoverContent>
        </Popover>
    );
}
