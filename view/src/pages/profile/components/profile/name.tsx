import { Pencil } from "lucide-react";
import { useState } from "react";

import { Button, Input } from "@/components";

export function Name() {
    const [loading, setLoading] = useState(false);
    const [edit, setEdit] = useState(false);
    const [name, setName] = useState("");

    async function handleNameChange() {
        if (loading || name.length < 1) return;
    }

    return (
        <div>
            <p className="mb-1 text-neutral-400 sm:text-lg">Name</p>
            {edit ? (
                <form onSubmit={handleNameChange}>
                    <Input type="text" placeholder="Example: John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                    <div className="mt-4 flex justify-end gap-x-4" onClick={() => setEdit(false)}>
                        <Button variant="outline" type="button">
                            Cancel
                        </Button>
                        <Button type="submit" loading={loading} disabled={name.length < 1}>
                            Update
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="flex items-center gap-x-6">
                    <p className="sm:text-lg">Angkush Sahu</p>
                    <Button size="icon" variant="outline" className="rounded-full" onClick={() => setEdit(true)}>
                        <Pencil className="size-4 text-neutral-400" />
                    </Button>
                </div>
            )}
        </div>
    );
}
