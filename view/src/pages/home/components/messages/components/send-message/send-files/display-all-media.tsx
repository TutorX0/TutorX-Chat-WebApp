import { useEffect, useRef, type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import { PlusIcon } from "lucide-react";

import { Button, ScrollArea, ScrollBar } from "@/components";
import { Document, ImageOrVideo } from "./media-display";
import type { FileType } from "@/types";
import { useStore } from "@/store";
import { cn } from "@/lib";

type DisplayAllMediaProps = {
    fileType: FileType;
    selectedId: string;
    setSelectedId: Dispatch<SetStateAction<string>>;
};

export function DisplayAllMedia({ fileType, selectedId, setSelectedId }: DisplayAllMediaProps) {
    const documentRef = useRef<HTMLInputElement>(null);

    const addFiles = useStore((state) => state.addFiles);
    const files = useStore((state) => state.files);

    useEffect(() => {
        const currentFileType = files[fileType];
        if (currentFileType.length > 0) setSelectedId(currentFileType[0].id);
    }, []);

    function uploadFiles(e: ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files) return;

        const fileArray = Array.from(files);
        const filesWithCaption = fileArray.map((file) => ({ file, message: "" }));
        const fileId = addFiles(filesWithCaption, fileType);
        setSelectedId(fileId);
    }

    return (
        <>
            {files[fileType].length > 0 ? (
                <ScrollArea className="max-w-[50vw] pb-4">
                    <section className="flex items-center justify-center gap-x-2 sm:gap-x-4">
                        {files[fileType].map(({ file, id, type }) => (
                            <div
                                key={`Small-media-icon-${id}`}
                                className={cn(
                                    "size-12 cursor-pointer rounded-md border p-2 sm:size-16",
                                    selectedId === id ? "border-green-700" : ""
                                )}
                                onClick={() => setSelectedId(id)}
                            >
                                {type === "image_videos" ? (
                                    <ImageOrVideo file={file} id={id} />
                                ) : type === "documents" ? (
                                    <Document file={file} preview />
                                ) : null}
                            </div>
                        ))}
                    </section>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            ) : null}
            <div className="pb-4">
                <input
                    multiple
                    type="file"
                    accept={fileType === "image_videos" ? "image/*,video/*" : "*"}
                    ref={documentRef}
                    className="hidden"
                    onChange={uploadFiles}
                />
                <Button variant="outline" className="size-12 rounded-md sm:size-16" onClick={() => documentRef.current?.click()}>
                    <PlusIcon className="size-6 text-neutral-500 sm:size-8" />
                </Button>
            </div>
        </>
    );
}
