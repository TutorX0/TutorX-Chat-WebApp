import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { ImageIcon, PlusIcon, X } from "lucide-react";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { AutosizeTextarea, Button, Dialog, DialogContent, DialogFooter, ScrollArea } from "@/components";
import { addFile, axiosClient, removeFile, trimFileName } from "@/lib";
import type { AutosizeTextAreaRef } from "@/components";
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
    const inputRef = useRef<AutosizeTextAreaRef>(null);

    const setReplyMessage = useStore((state) => state.setReplyMessage);

    useEffect(() => {
        setOpen(files.length > 0);
    }, [files]);

    if (files.length < 1) return null;

    async function sendDocMessage() {
        if (loading || !inputRef.current) return;

        setLoading(true);
        try {
            const formData = new FormData();
            for (const { file } of files) {
                formData.append("mediaUrl", file);
            }
            formData.append("phoneNumber", phoneNumber);
            formData.append("type", "document");
            formData.append("message", inputRef.current.textArea.value);

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
            <DialogContent className="max-h-[90vh] !w-full !max-w-[90vw] overflow-y-hidden sm:!max-w-[80vw]">
                <ScrollArea className="h-[58vh] px-4 sm:h-[60vh]">
                    <section className="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] place-items-center gap-8 sm:grid-cols-[repeat(auto-fill,minmax(15rem,1fr))]">
                        {files.map(({ file, id }) => (
                            <div
                                key={id}
                                className="relative flex size-[12rem] items-center justify-center rounded border bg-neutral-900/50 p-2 sm:size-[15rem]"
                            >
                                <div
                                    className="absolute top-2 right-2 z-20 cursor-pointer rounded-full bg-black/40 p-1"
                                    onClick={() => removeFile(id, setFiles)}
                                >
                                    <X className="size-4" />
                                </div>
                                {file.type.includes("image") ? (
                                    <Image file={file} />
                                ) : file.type.includes("video") ? (
                                    <Video file={file} />
                                ) : (
                                    <Document file={file} />
                                )}
                            </div>
                        ))}
                        <div
                            className="flex size-[12rem] cursor-pointer items-center justify-center rounded-md border bg-neutral-900/50 sm:size-[15rem]"
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
                    <AutosizeTextarea
                        className="border-message-input outline-message-input focus-visible:border-message-input focus-visible:outline-message-input custom-scroll order-1 resize-none ring-0 ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 sm:order-none"
                        placeholder="Type a message"
                        minHeight={10}
                        maxHeight={108}
                        ref={inputRef}
                    />
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
    return <img src={url} alt={file.name} className="size-full rounded object-contain" />;
}

function Video({ file }: FileProps) {
    const url = URL.createObjectURL(file);
    return <video src={url} controls className="size-full rounded object-contain" />;
}

function Document({ file }: FileProps) {
    const url = URL.createObjectURL(file);
    const supported = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    const trimmedFileName = trimFileName(file.name, 10);

    if (!supported.includes(file.type)) {
        return (
            <div className="flex flex-col items-center justify-center gap-3">
                <ImageIcon className="size-20 text-neutral-600" strokeWidth="1" />
                <span className="text-neutral-400">Preview unavailable</span>
                <span>{trimmedFileName}</span>
            </div>
        );
    }

    return <iframe src={url} className="size-full rounded object-contain" />;
}
