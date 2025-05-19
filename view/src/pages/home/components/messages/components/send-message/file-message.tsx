import { CreditCardIcon, FileIcon, FolderOpenIcon, ImageIcon, Paperclip, VideoIcon } from "lucide-react";
import { useRef, useState, type Dispatch, type SetStateAction } from "react";

import { Button, Popover, PopoverContent, PopoverTrigger } from "@/components";
import { googleMeetMessage, paymentMessage } from "./constants";
import type { UploadFile } from "@/types";
import { addFile } from "@/lib";

type FileMessageProps = {
    files: UploadFile[];
    setFiles: Dispatch<SetStateAction<UploadFile[]>>;
    setMessage: Dispatch<SetStateAction<string>>;
    setFileDialogOpen: Dispatch<SetStateAction<boolean>>;
};

export function FileMessage({ files, setFiles, setMessage, setFileDialogOpen }: FileMessageProps) {
    const [open, setOpen] = useState(false);

    const imageRef = useRef<HTMLInputElement>(null);
    const documentRef = useRef<HTMLInputElement>(null);

    function sendConstantTexts(type: "google_meet" | "payment") {
        if (type === "google_meet") setMessage(googleMeetMessage);
        else if (type === "payment") setMessage(paymentMessage);
        setOpen(false);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="secondary" size="icon" className="hover:bg-input-buttons-hover mb-0.5 rounded-full">
                    <Paperclip />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-full">
                {files.length > 0 ? (
                    <div
                        className="flex cursor-pointer items-center gap-2 pt-1 pb-2 text-sm"
                        onClick={() => setFileDialogOpen(true)}
                    >
                        <FolderOpenIcon className="size-5" />
                        <span>File lobby</span>
                        <span className="text-sm">
                            {"("}
                            {files.length}
                            {")"}
                        </span>
                        <input
                            type="file"
                            ref={imageRef}
                            className="hidden"
                            accept="image/*,video/*"
                            onChange={(e) => addFile(e, files, setFiles)}
                        />
                    </div>
                ) : null}
                <div
                    className="flex cursor-pointer items-center gap-2 pt-1 pb-2 text-sm"
                    onClick={() => imageRef.current?.click()}
                >
                    <ImageIcon className="size-5" />
                    <span>Photos & videos</span>
                    <input
                        type="file"
                        ref={imageRef}
                        className="hidden"
                        accept="image/*,video/*"
                        onChange={(e) => addFile(e, files, setFiles)}
                    />
                </div>
                <div
                    className="flex cursor-pointer items-center gap-2 pt-2 pb-2 text-sm"
                    onClick={() => documentRef.current?.click()}
                >
                    <FileIcon className="size-5" />
                    <span>Document</span>
                    <input type="file" ref={documentRef} className="hidden" onChange={(e) => addFile(e, files, setFiles)} />
                </div>
                <div
                    className="flex cursor-pointer items-center gap-2 pt-2 pb-2 text-sm"
                    onClick={() => sendConstantTexts("google_meet")}
                >
                    <VideoIcon className="size-5" />
                    <span>Google Meet</span>
                </div>
                <div
                    className="flex cursor-pointer items-center gap-2 pt-2 pb-2 text-sm"
                    onClick={() => sendConstantTexts("payment")}
                >
                    <CreditCardIcon className="size-5" />
                    <span>Payment</span>
                </div>
            </PopoverContent>
        </Popover>
    );
}
