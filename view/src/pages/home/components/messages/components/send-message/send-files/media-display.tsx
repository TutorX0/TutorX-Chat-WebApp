import { ImageIcon } from "lucide-react";
import { useMemo } from "react";

import { cn, trimFileName } from "@/lib";

type ImageOrVideoProps = {
    id: string;
    file: File;
    controls?: boolean;
};

export function ImageOrVideo({ file, id, controls = false }: ImageOrVideoProps) {
    const url = useMemo(() => URL.createObjectURL(file), [id]);

    if (file.type.includes("image")) return <img src={url} alt={file.name} className="size-full rounded object-contain" />;
    return <video src={url} className="size-full rounded object-contain" controls={controls} />;
}

type DocumentProps = {
    file: File;
    preview?: boolean;
};

export function Document({ file, preview = false }: DocumentProps) {
    const trimmedFileName = trimFileName(file.name, 30);

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-md",
                preview ? "h-full" : "h-11/12 border px-20"
            )}
        >
            <ImageIcon className={cn("text-neutral-600", preview ? "size-8" : "size-20")} strokeWidth="1" />
            {preview ? null : (
                <>
                    <span className="text-neutral-400">Document</span>
                    <span>{trimmedFileName}</span>
                </>
            )}
        </div>
    );
}
