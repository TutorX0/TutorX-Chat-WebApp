import { Pencil } from "lucide-react";
import { useState } from "react";

import { AutosizeTextarea, Button } from "@/components";

export function About() {
    const [loading, setLoading] = useState(false);
    const [edit, setEdit] = useState(false);
    const [about, setAbout] = useState("");

    async function handleNameChange() {
        if (loading || about.length < 1) return;
    }

    return (
        <div>
            <p className="mb-1 text-neutral-400 sm:text-lg">About</p>
            {edit ? (
                <form onSubmit={handleNameChange}>
                    <AutosizeTextarea
                        className="resize-none"
                        placeholder="Example: John Doe"
                        minHeight={10}
                        maxHeight={150}
                        autoFocus
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                    />
                    <div className="mt-4 flex justify-end gap-x-4" onClick={() => setEdit(false)}>
                        <Button variant="outline" type="button">
                            Cancel
                        </Button>
                        <Button type="submit" loading={loading} disabled={about.length < 1}>
                            Update
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="flex gap-x-6">
                    <p className="sm:text-lg">
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid, praesentium adipisci laudantium
                        assumenda perspiciatis quaerat doloribus pariatur, distinctio deserunt neque, error unde? Iusto soluta
                        natus aut iste at odio fugit?
                    </p>
                    <Button size="icon" variant="outline" className="rounded-full" onClick={() => setEdit(true)}>
                        <Pencil className="size-4 text-neutral-400" />
                    </Button>
                </div>
            )}
        </div>
    );
}
