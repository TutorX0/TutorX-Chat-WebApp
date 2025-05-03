import { useState, type Dispatch, type SetStateAction } from "react";
import { AxiosError } from "axios";
import { X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components";
import { axiosClient } from "@/lib";

type FileListProps = {
    files: File[];
    setFiles: Dispatch<SetStateAction<File[]>>;
    phoneNumber: string;
};

export function FileList({ files, setFiles, phoneNumber }: FileListProps) {
    const [loading, setLoading] = useState(false);

    if (files.length < 1) return null;

    function removeIndex(indexToRemove: number) {
        setFiles((files) => files.filter((_, index) => index !== indexToRemove));
    }

    const toBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });

    async function sendDocMessage() {
        if (loading) return;

        setLoading(true);
        try {
            const results = await Promise.allSettled(
                files.map(async (file) => {
                    const base64 = await toBase64(file);

                    return axiosClient.post("/chat/send", {
                        phoneNumber,
                        message: "",
                        mediaUrl: base64,
                        type: file.type.includes("image")
                            ? "image"
                            : file.type.includes("video")
                              ? "video"
                              : file.type.includes("application")
                                ? "document"
                                : ""
                    });
                })
            );

            results.forEach((result, index) => {
                if (result.status !== "fulfilled") {
                    toast.error(`File ${index + 1} failed`, result.reason);
                }
            });
        } catch (error: unknown) {
            let message = "An unexpected error was returned from the server";
            if (error instanceof AxiosError) message = error?.response?.data?.message;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-background absolute bottom-4 max-h-[80vh] w-4/5 overflow-y-auto pt-4">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] place-items-center gap-4 pb-4">
                {files.map((file, index) => (
                    <div key={file.name} className="relative bg-neutral-800">
                        <div
                            className="absolute top-2 right-2 cursor-pointer rounded-full bg-black/40 p-1"
                            onClick={() => removeIndex(index)}
                        >
                            <X className="size-4" />
                        </div>
                        {file.type.includes("image") ? (
                            <Image file={file} />
                        ) : file.type.includes("video") ? (
                            <Video file={file} />
                        ) : file.type.includes("application") ? (
                            <Document file={file} />
                        ) : null}
                    </div>
                ))}
            </div>
            <div className="sticky bottom-0 flex items-center justify-between bg-neutral-800 p-2">
                <Button disabled={loading} variant="outline" onClick={() => setFiles([])}>
                    Cancel
                </Button>
                <Button disabled={loading} onClick={sendDocMessage}>
                    Send
                </Button>
            </div>
        </div>
    );
}

type FileProps = {
    file: File;
};

function Image({ file }: FileProps) {
    const url = URL.createObjectURL(file);
    return <img src={url} alt={file.name} className="size-60 rounded object-contain" />;
}

function Video({ file }: FileProps) {
    const url = URL.createObjectURL(file);
    return <video src={url} controls className="size-60 rounded object-contain" />;
}

function Document({ file }: FileProps) {
    const url = URL.createObjectURL(file);
    return <iframe src={url} className="size-60 rounded object-contain" style={{}} />;
}
