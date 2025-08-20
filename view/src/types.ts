export type FileType = "image_videos" | "documents";

export type UploadFile = {
    id: string;
    type: FileType;
    file: File;
    message: string;
};
