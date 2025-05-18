import { useEffect, useRef, useState, type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import { PlusIcon, X } from "lucide-react";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { Button, Dialog, DialogContent, DialogFooter, ScrollArea } from "@/components";
import { axiosClient } from "@/lib";
import { useStore } from "@/store";

type FileListProps = {
    files: File[];
    setFiles: Dispatch<SetStateAction<File[]>>;
    phoneNumber: string;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

export function FileList({ files, open, phoneNumber, setFiles, setOpen }: FileListProps) {
    const [loading, setLoading] = useState(false);

    const documentRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const setReplyMessage = useStore((state) => state.setReplyMessage);

    useEffect(() => {
        setOpen(files.length > 0);
    }, [files]);

    if (files.length < 1) return null;

    function addFile(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setFiles((prev) => [...prev, file]);
    }

    function removeIndex(indexToRemove: number) {
        setFiles((files) => files.filter((_, index) => index !== indexToRemove));
    }

    // const toBase64 = (file: File): Promise<string> =>
    //     new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.readAsDataURL(file);
    //         reader.onload = () => resolve(reader.result as string);
    //         reader.onerror = reject;
    //     });

    async function sendDocMessage() {
        if (loading || !inputRef.current) return;

        setLoading(true);
        try {
            const file = files[0];

            const formData = new FormData();
            formData.append("mediaUrl", file);
            formData.append("phoneNumber", phoneNumber);
            formData.append("message", inputRef.current.value);
            formData.append(
                "type",
                file.type.includes("image")
                    ? "image"
                    : file.type.includes("video")
                      ? "video"
                      : file.type.includes("application")
                        ? "document"
                        : ""
            );

            await axiosClient.post("/chat/send", formData);

            // const results = await Promise.allSettled(
            //     files.map(async (file) => {
            //         const base64 = await toBase64(file);

            //         return axiosClient.post("/chat/send", {
            //             phoneNumber,
            //             message: "",
            //             mediaUrl: base64,
            //             type: file.type.includes("image")
            //                 ? "image"
            //                 : file.type.includes("video")
            //                   ? "video"
            //                   : file.type.includes("application")
            //                     ? "document"
            //                     : ""
            //         });
            //     })
            // );

            // results.forEach((result, index) => {
            //     if (result.status !== "fulfilled") {
            //         toast.error(`File ${index + 1} failed`, result.reason);
            //     }
            // });
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

    // return (
    //     <div className="bg-background absolute bottom-4 z-50 max-h-[80vh] w-full max-w-96 overflow-y-auto rounded-md pt-4">
    //         <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] place-items-center gap-4 pb-4">
    //             {files.map((file, index) => (
    //                 <div key={file.name} className="relative bg-neutral-800">
    //                     <div
    //                         className="absolute top-2 right-2 cursor-pointer rounded-full bg-black/40 p-1"
    //                         onClick={() => removeIndex(index)}
    //                     >
    //                         <X className="size-4" />
    //                     </div>
    //                     {file.type.includes("image") ? (
    //                         <Image file={file} />
    //                     ) : file.type.includes("video") ? (
    //                         <Video file={file} />
    //                     ) : file.type.includes("application") ? (
    //                         <Document file={file} />
    //                     ) : null}
    //                 </div>
    //             ))}
    //         </div>
    //         <div className="mx-1 my-2">
    //             <Input placeholder="Type a message ....." autoFocus ref={inputRef} />
    //         </div>
    //         <div className="sticky bottom-0 flex items-center justify-between rounded-md bg-neutral-800 p-2">
    //             <Button variant="secondary" className="rounded-full" disabled={loading} onClick={() => setFiles([])}>
    //                 Cancel
    //             </Button>
    //             <Button variant="outline" className="rounded-full" disabled={loading} onClick={sendDocMessage}>
    //                 Send
    //             </Button>
    //         </div>
    //     </div>
    // );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-h-[80vh] !w-full !max-w-[80vw]">
                <ScrollArea className="h-[68vh] px-4">
                    <section className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] place-items-center gap-8">
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
                        <div
                            className="flex h-60 w-full cursor-pointer items-center justify-center rounded-md border bg-neutral-900/50"
                            onClick={() => documentRef.current?.click()}
                        >
                            <PlusIcon className="size-6 text-neutral-400" />
                            <input type="file" ref={documentRef} className="hidden" onChange={addFile} />
                        </div>
                    </section>
                </ScrollArea>
                <DialogFooter>
                    <Button variant="outline" className="rounded-full" disabled={loading} onClick={() => setFiles([])}>
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
