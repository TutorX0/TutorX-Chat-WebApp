import { useState, type PropsWithChildren } from "react";

import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "@/components";
import { ShowSelectedFile } from "./show-selected-file";
import { DisplayAllMedia } from "./display-all-media";
import { ActionButtons } from "./action-buttons";
import type { FileType } from "@/types";

type SendFilesProps = PropsWithChildren<{
    fileType: FileType;
}>;

export function SendFiles({ children, fileType }: SendFilesProps) {
    const [selectedId, setSelectedId] = useState("");

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-h-[90vh] !w-full !max-w-[90vw] overflow-y-hidden sm:!max-w-[80vw]">
                <ShowSelectedFile fileType={fileType} selectedId={selectedId} setSelectedId={setSelectedId} />
                <DialogFooter className="flex w-full flex-row items-center justify-center sm:justify-center sm:gap-x-4">
                    <DisplayAllMedia fileType={fileType} selectedId={selectedId} setSelectedId={setSelectedId} />
                </DialogFooter>
                <ActionButtons fileType={fileType} />
            </DialogContent>
        </Dialog>
    );
}
