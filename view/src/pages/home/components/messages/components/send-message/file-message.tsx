import { CreditCardIcon, FileIcon, ImageIcon, Paperclip, VideoIcon } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";

import { Button, Popover, PopoverContent, PopoverTrigger } from "@/components";
import { googleMeetMessage, paymentMessage } from "./constants";
import { SendFiles } from "./send-files";

type FileMessageProps = {
    setMessage: Dispatch<SetStateAction<string>>;
};

export function FileMessage({ setMessage }: FileMessageProps) {
    const [open, setOpen] = useState(false);

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
                <SendFiles fileType="image_videos">
                    <div className="flex cursor-pointer items-center gap-2 pt-1 pb-2 text-sm">
                        <ImageIcon className="size-5" />
                        <span>Photos & videos</span>
                    </div>
                </SendFiles>
                <SendFiles fileType="documents">
                    <div className="flex cursor-pointer items-center gap-2 pt-2 pb-2 text-sm">
                        <FileIcon className="size-5" />
                        <span>Document</span>
                    </div>
                </SendFiles>
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
