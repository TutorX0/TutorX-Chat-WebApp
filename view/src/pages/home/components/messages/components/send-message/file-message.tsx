import { useRef, type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import { FileIcon, ImageIcon, Paperclip } from "lucide-react";

import { Button, Popover, PopoverContent, PopoverTrigger } from "@/components";

type FileMessageProps = {
    setFiles: Dispatch<SetStateAction<File[]>>;
};

export function FileMessage({ setFiles }: FileMessageProps) {
    const imageRef = useRef<HTMLInputElement>(null);
    const documentRef = useRef<HTMLInputElement>(null);

    function addFile(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setFiles((prev) => [...prev, file]);
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="secondary" size="icon" className="hover:bg-input-buttons-hover rounded-full">
                    <Paperclip />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full">
                <div>
                    <div
                        className="flex cursor-pointer items-center gap-2 pt-1 pb-2 text-sm"
                        onClick={() => imageRef.current?.click()}
                    >
                        <ImageIcon className="size-5" />
                        <span>Photos & videos</span>
                        <input type="file" ref={imageRef} className="hidden" accept="image/*,video/*" onChange={addFile} />
                    </div>
                    <div
                        className="flex cursor-pointer items-center gap-2 pt-2 pb-2 text-sm"
                        onClick={() => documentRef.current?.click()}
                    >
                        <FileIcon className="size-5" />
                        <span>Document</span>
                        <input type="file" ref={documentRef} className="hidden" onChange={addFile} />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
