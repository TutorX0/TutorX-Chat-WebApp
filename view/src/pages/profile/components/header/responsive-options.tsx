import { Menu } from "lucide-react";
import { useState } from "react";

import { Button, Sheet, SheetContent, SheetTrigger } from "@/components";
import { ProfileSidebar } from "../sidebar";

type ResponsiveOptionsProps = {
    currentTab: string | null;
};

export function ResponsiveOptions({ currentTab }: ResponsiveOptionsProps) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon" className="rounded-full">
                    <Menu strokeWidth="1" className="size-5 cursor-pointer text-neutral-400" />
                </Button>
            </SheetTrigger>
            <SheetContent className="md:hidden">
                <ProfileSidebar currentTab={currentTab} setOpen={setOpen} isResponsive />
            </SheetContent>
        </Sheet>
    );
}
