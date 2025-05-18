import { Link, useSearchParams } from "react-router-dom";
import { User } from "lucide-react";

import { homeUrl, profileUrl } from "@/routing";
import { AddNumber } from "./add-number";
import { Button } from "@/components";
import logo from "@/assets/logo.webp";

export function Header() {
    const [searchParams] = useSearchParams();
    const chatType = searchParams.get("chat_type") ?? "chats";

    return (
        <header className="bg-header flex items-center justify-between px-4 py-2">
            <Link to={`${homeUrl}?chat_type=${chatType}`} className="flex items-center gap-4">
                <img src={logo} alt="TutorX Logo" loading="lazy" className="size-8" />
                <span className="text-sm">TutorX</span>
            </Link>
            <div className="flex items-center gap-x-2">
                <AddNumber />
                <Link to={`${profileUrl}?tab=profile`} className="rounded-full">
                    <Button variant="outline" size="icon" className="rounded-full">
                        <User strokeWidth="1" className="size-6 cursor-pointer text-neutral-400" />
                    </Button>
                </Link>
            </div>
        </header>
    );
}
