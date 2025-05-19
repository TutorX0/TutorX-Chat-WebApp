import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { v4 as uuid } from "uuid";

import type { UploadFile } from "@/types";

export function addFile(e: ChangeEvent<HTMLInputElement>, files: UploadFile[], setFiles: Dispatch<SetStateAction<UploadFile[]>>) {
    const file = e.target.files?.[0];
    if (!file || files.length >= 10) return;
    setFiles((prev) => [...prev, { file, id: uuid() }]);
}

export function removeFile(id: string, setFiles: Dispatch<SetStateAction<UploadFile[]>>) {
    setFiles((prev) => prev.filter((file) => file.id !== id));
}
