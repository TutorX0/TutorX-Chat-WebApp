import type { Dispatch, SetStateAction } from "react";

import { Document, ImageOrVideo } from "./media-display";
import { AutosizeTextarea, Button } from "@/components";
import type { FileType, UploadFile } from "@/types";
import { useStore } from "@/store";

type ShowSelectedFileProps = {
    fileType: FileType;
    selectedId: string;
    setSelectedId: Dispatch<SetStateAction<string>>;
};

export function ShowSelectedFile({ fileType, selectedId, setSelectedId }: ShowSelectedFileProps) {
    const removeFile = useStore((state) => state.removeFile);
    const files = useStore((state) => state.files);

    const selectedFile = files[fileType].find((file) => file.id === selectedId);

    function removeCurrentFile() {
        removeFile(selectedId, fileType);

        const currentFileType = files[fileType];
        if (currentFileType.length > 0) setSelectedId(currentFileType[currentFileType.length - 1].id);
    }

    return (
        <section className="mb-4 flex flex-col items-center justify-center gap-x-10 lg:flex-row">
            <div className="h-[35vh] lg:h-[50vh]">
                {selectedFile ? (
                    selectedFile.type === "image_videos" ? (
                        <ImageOrVideo file={selectedFile.file} id={selectedFile.id} controls />
                    ) : selectedFile.type === "documents" ? (
                        <Document file={selectedFile.file} />
                    ) : null
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <h1 className="text-2xl text-neutral-400">
                            {files[fileType].length > 0 ? "Choose a file" : "Upload a file"}
                        </h1>
                    </div>
                )}
            </div>
            {selectedFile ? (
                <div className="mt-6 w-full max-w-xl">
                    <ResponsiveTextarea fileType={fileType} selectedFile={selectedFile} />
                    <div className="mt-4 flex justify-center lg:justify-end">
                        <Button variant="secondary" className="rounded-full" onClick={removeCurrentFile}>
                            Remove this document
                        </Button>
                    </div>
                </div>
            ) : null}
        </section>
    );
}

type ResponsiveTextareaProps = {
    fileType: FileType;
    selectedFile: UploadFile;
};

function ResponsiveTextarea({ fileType, selectedFile }: ResponsiveTextareaProps) {
    const updateCaption = useStore((state) => state.updateCaption);

    return (
        <>
            <AutosizeTextarea
                className="bg-message-input border-message-input outline-message-input focus-visible:border-message-input focus-visible:outline-message-input custom-scroll hidden resize-none ring-0 ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 lg:flex"
                placeholder="Type a message"
                minHeight={200}
                maxHeight={300}
                autoFocus
                value={selectedFile.message}
                onChange={(e) => updateCaption(selectedFile.id, fileType, e.target.value)}
            />
            <AutosizeTextarea
                className="bg-message-input border-message-input outline-message-input focus-visible:border-message-input focus-visible:outline-message-input custom-scroll resize-none ring-0 ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
                placeholder="Type a message"
                minHeight={10}
                maxHeight={90}
                autoFocus
                value={selectedFile.message}
                onChange={(e) => updateCaption(selectedFile.id, fileType, e.target.value)}
            />
        </>
    );
}
