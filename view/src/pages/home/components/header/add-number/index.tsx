import { Plus } from "lucide-react";

import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components";
import { NumberForm } from "./number-form";

export function AddNumber() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                    <Plus strokeWidth="1" className="size-6 cursor-pointer text-neutral-400" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Contact</DialogTitle>
                </DialogHeader>
                <NumberForm />
            </DialogContent>
        </Dialog>
    );
}
