import type { FileType } from "@/types";
import { Button } from "@/components";
import { useStore } from "@/store";

export function ActionButtons({ fileType }: { fileType: FileType }) {
    const clearFiles = useStore((state) => state.clearFiles);

    return (
        <div className="flex flex-col items-center justify-center gap-y-2">
            <Button variant="outline" className="w-40 rounded-full" onClick={() => clearFiles(fileType)}>
                Remove all files
            </Button>
            <Button variant="secondary" className="w-40 rounded-full">
                Send
            </Button>
        </div>
    );
}
