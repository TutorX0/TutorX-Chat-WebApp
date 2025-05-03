import { Skeleton } from "@/components";

export function ChatItemsLoading() {
    return Array.from({ length: 10 }).map((_, index) => <Skeleton key={`Loading-Chat-Item${index + 1}`} className="my-4 h-16" />);
}
