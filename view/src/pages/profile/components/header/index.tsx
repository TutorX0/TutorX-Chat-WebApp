import { Link } from "react-router-dom";
import { Users } from "lucide-react";

import { ResponsiveOptions } from "./responsive-options";
import logo from "@/assets/logo.webp";
import { Button } from "@/components";
import { homeUrl } from "@/routing";

type HeaderProps = {
    currentTab: string | null;
};

export function Header({ currentTab }: HeaderProps) {
    return (
        <header className="bg-header flex items-center justify-between px-4 py-2">
            <Link to={homeUrl} className="flex items-center gap-2">
                <img src={logo} alt="TutorX Logo" loading="lazy" className="size-8" />
                <span>TutorX</span>
            </Link>
            <div className="flex items-center gap-x-2">
                <Link to={`${homeUrl}?tab=profile`} className="rounded-full">
                    <Button variant="outline" size="icon" className="rounded-full">
                        <Users strokeWidth="1" className="size-5 cursor-pointer text-neutral-400" />
                    </Button>
                </Link>
                <ResponsiveOptions currentTab={currentTab} />
            </div>
        </header>
    );
}
