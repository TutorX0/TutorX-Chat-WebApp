import { User } from "lucide-react";

import { Button, Popover, PopoverContent, PopoverTrigger } from "@/components";
import { UpdateEmail } from "./update-email";
import { useStore } from "@/store";

export function ProfileDropDown() {
    const user = useStore((state) => state.user);
    // if (!user) return null;

    return (
        <div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                        <User strokeWidth="1" className="size-6 cursor-pointer text-neutral-400" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="space-y-4">
                    <UpdateEmail email="angkushsahu2502@gmail.com" />
                    <div>
                        <Button variant="destructive" className="bg-red-600 hover:bg-red-600/90">
                            Logout
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
