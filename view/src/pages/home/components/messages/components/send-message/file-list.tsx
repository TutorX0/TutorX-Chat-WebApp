import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { PlusIcon, X } from "lucide-react";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { Button, Dialog, DialogContent, DialogFooter, ScrollArea } from "@/components";
import { addFile, axiosClient, removeFile } from "@/lib";
import type { UploadFile } from "@/types";
import { useStore } from "@/store";

type FileListProps = {
    files: UploadFile[];
    setFiles: Dispatch<SetStateAction<UploadFile[]>>;
    phoneNumber: string;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

export function FileList({ files, open, phoneNumber, setFiles, setOpen }: FileListProps) {
    const [loading, setLoading] = useState(false);

    const documentRef = useRef<HTMLInputElement>(null);

    const setReplyMessage = useStore((state) => state.setReplyMessage);

    useEffect(() => {
        setOpen(files.length > 0);
    }, [files]);

    if (files.length < 1) return null;

    async function sendDocMessage() {
        if (loading) return;

        setLoading(true);
        try {
            const formData = new FormData();
            for (const { file } of files) {
                formData.append("mediaUrl", file);
            }
            formData.append("phoneNumber", phoneNumber);
            formData.append("type", "document");

            await axiosClient.post("/chat/send", formData);

            setFiles([]);
            setReplyMessage(null);
        } catch (error: unknown) {
            let message = "An unexpected error was returned from the server";
            if (error instanceof AxiosError) message = error?.response?.data?.message;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-h-[80vh] !w-full !max-w-[90vw] sm:!max-w-[80vw]">
                <ScrollArea className="h-[58vh] px-4 sm:h-[68vh]">
                    <section className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] place-items-center gap-8">
                        {files.map(({ file, id }) => (
                            <div key={id} className="relative bg-neutral-800">
                                <div
                                    className="absolute top-2 right-2 z-10 cursor-pointer rounded-full bg-black/40 p-1"
                                    onClick={() => removeFile(id, setFiles)}
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
                        <div
                            className="flex h-60 w-full max-w-60 cursor-pointer items-center justify-center rounded-md border bg-neutral-900/50"
                            onClick={() => documentRef.current?.click()}
                        >
                            <PlusIcon className="size-6 text-neutral-400" />
                            <input
                                type="file"
                                ref={documentRef}
                                className="hidden"
                                onChange={(e) => addFile(e, files, setFiles)}
                            />
                        </div>
                    </section>
                </ScrollArea>
                <DialogFooter>
                    <Button variant="outline" className="rounded-full" onClick={() => setFiles([])}>
                        Clear all
                    </Button>
                    <Button variant="secondary" className="rounded-full" disabled={loading} onClick={sendDocMessage}>
                        Send
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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
