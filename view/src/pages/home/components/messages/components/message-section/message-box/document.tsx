import logo from "@/assets/logo.webp";
import { MessageOptions } from "./message-options";
import { cn } from "@/lib";

type DocumentMessageProps = {
    sentBy: "me" | "him";
};

export function DocumentMessage({ sentBy }: DocumentMessageProps) {
    let caption =
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit, deserunt rerum! Eaque amet ad facere quaerat, dictatotam, quo eum excepturi expedita architecto eius qui quidem fugit fuga modi sint.";

    return (
        <MessageOptions textToCopy={caption}>
            <div
                className={cn(
                    "my-2 w-10/12 max-w-xs rounded-md p-3 shadow-md",
                    sentBy === "me" ? "ml-auto bg-indigo-900" : "bg-neutral-900"
                )}
            >
                <div className="mb-2.5 rounded-md bg-neutral-300 p-3">
                    <img src={logo} alt="A random WhatsApp image" className="size-full" loading="lazy" />
                </div>
                <p>{caption}</p>
                <div className="flex items-center justify-end">
                    <p className="text-xs text-neutral-400">21:43</p>
                </div>
            </div>
        </MessageOptions>
    );
}
