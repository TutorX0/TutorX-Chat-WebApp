import { Pencil } from "lucide-react";
import { useState } from "react";

import { Button, Input } from "@/components";

export function Account() {
    const [loading, setLoading] = useState(false);
    const [edit, setEdit] = useState(false);
    const [email, setEmail] = useState("");

    async function handleNameChange() {
        if (loading || email.length < 1) return;
    }

    return (
        <section className="mx-auto flex w-full max-w-2xl grow flex-col justify-center p-5">
            <p className="mb-1 text-neutral-400 sm:text-lg md:text-base lg:text-lg">E-mail</p>
            {edit ? (
                <form onSubmit={handleNameChange}>
                    <Input type="text" placeholder="Example: John Doe" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <div className="mt-4 flex justify-end gap-x-4" onClick={() => setEdit(false)}>
                        <Button variant="outline" type="button">
                            Cancel
                        </Button>
                        <Button type="submit" loading={loading} disabled={email.length < 1}>
                            Update
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="flex gap-x-6">
                    <p className="break-all sm:text-lg md:text-base lg:text-lg">
                        angkushsahuloremipsumdolorsetametconsectetor@gmail.com
                    </p>
                    <Button size="icon" variant="outline" className="rounded-full" onClick={() => setEdit(true)}>
                        <Pencil className="size-4 text-neutral-400" />
                    </Button>
                </div>
            )}
        </section>
    );
}
