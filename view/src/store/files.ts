import type { StateCreator } from "zustand";
import { v4 as uuid } from "uuid";

import type { FileType, UploadFile } from "@/types";

export type FileSlice = {
    files: {
        image_videos: UploadFile[];
        documents: UploadFile[];
    };
    addFiles: (filesWithCaption: { file: File; message: string }[], type: FileType) => string;
    removeFile: (id: string, type: FileType) => void;
    clearFiles: (type: FileType) => void;
    updateCaption: (id: string, type: FileType, newCaption: string) => void;
};

export const createFileSlice: StateCreator<FileSlice> = (set) => ({
    files: {
        image_videos: [],
        documents: []
    },
    addFiles: (filesWithCaption, type) => {
        const uniqueIds: string[] = [];

        const newFiles: UploadFile[] = Array.from(filesWithCaption).map(({ file, message }) => {
            const uniqueId = uuid();
            uniqueIds.push(uniqueId);

            return {
                id: uniqueId,
                file,
                type,
                message
            };
        });

        set((state) => ({
            files: {
                ...state.files,
                [type]: [...state.files[type], ...newFiles]
            }
        }));

        return uniqueIds[uniqueIds.length - 1];
    },
    removeFile: (id, type) =>
        set((state) => ({
            files: {
                ...state.files,
                [type]: state.files[type].filter((f) => f.id !== id)
            }
        })),
    clearFiles: (type) =>
        set((state) => ({
            files: {
                ...state.files,
                [type]: []
            }
        })),
    updateCaption: (id, type, newCaption) =>
        set((state) => ({
            files: {
                ...state.files,
                [type]: state.files[type].map((file) => (file.id === id ? { ...file, message: newCaption } : file))
            }
        }))
});
