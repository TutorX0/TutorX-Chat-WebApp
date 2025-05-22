import { useState, type Dispatch, type SetStateAction } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";

import type { FileType } from "@/types";
import { Button } from "@/components";
import { axiosClient } from "@/lib";
import { useStore } from "@/store";

type ActionButtonsProps = {
    fileType: FileType;
    setOpen: Dispatch<SetStateAction<boolean>>;
    phoneNumber: string;
};

export function ActionButtons({ fileType, phoneNumber, setOpen }: ActionButtonsProps) {
    const [loading, setLoading] = useState(false);

    const clearFiles = useStore((state) => state.clearFiles);
    const files = useStore((state) => state.files);

    async function sendFiles() {
        if (loading || files[fileType].length <= 0) return;

        const formData = new FormData();

        files[fileType].forEach((item, index) => {
            let currentFileType = "";
            if (fileType === "documents") currentFileType = "document";
            else if (item.file.type.includes("image")) currentFileType = "image";
            else if (item.file.type.includes("video")) currentFileType = "video";

            formData.append(`files[${index}][id]`, item.id);
            formData.append(`files[${index}][type]`, currentFileType);
            formData.append(`files[${index}][file]`, item.file);
            formData.append(`files[${index}][message]`, item.message);
        });

        setLoading(true);

        try {
            await axiosClient.post(`/chat/send-multiple-files/${phoneNumber}`, formData);
            setOpen(false);
        } catch (error: unknown) {
            let message = "An unexpected error was returned from the server";
            if (error instanceof AxiosError) message = error?.response?.data?.message;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center gap-y-2">
            <Button variant="outline" className="w-40 rounded-full" onClick={() => clearFiles(fileType)}>
                Remove all files
            </Button>
            <Button variant="secondary" className="w-40 rounded-full" loading={loading} onClick={sendFiles}>
                Send
            </Button>
        </div>
    );
}
