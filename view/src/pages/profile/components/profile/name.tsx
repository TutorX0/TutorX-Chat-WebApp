import { useState, type FormEvent } from "react";
import { Pencil } from "lucide-react";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { updateUserFields } from "@/validations";
import { Button, Input } from "@/components";
import { axiosClient, cn } from "@/lib";
import { useStore } from "@/store";

export function Name() {
    const user = useStore((state) => state.user);
    const setUser = useStore((state) => state.setUser);

    const [loading, setLoading] = useState(false);
    const [edit, setEdit] = useState(false);
    const [name, setName] = useState(user?.name ?? "");

    async function handleNameChange(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (loading || name.length < 1 || !user) return;

        setLoading(true);
        try {
            const response = await axiosClient.put("/user/update-about", { email: user.email, name, about: user.about });

            const parsedResponse = updateUserFields.safeParse(response.data);
            if (!parsedResponse.success) return toast.error("Invalid data type sent from server");

            const updatedUser = parsedResponse.data.user;
            setUser({ ...user, name: updatedUser.name });

            toast.success(parsedResponse.data.message);
        } catch (error: unknown) {
            let message = "An unexpected error was returned from the server";
            if (error instanceof AxiosError) message = error?.response?.data?.message;
            toast.error(message);
        } finally {
            setLoading(false);
            setEdit(false);
        }
    }

    return (
        <div>
            <p className="mb-1 text-neutral-400 sm:text-lg">Name</p>
            {edit ? (
                <form onSubmit={handleNameChange}>
                    <Input type="text" placeholder="Example: John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                    <div className="mt-4 flex justify-end gap-x-4">
                        <Button variant="outline" type="button" onClick={() => setEdit(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={loading} disabled={name.length < 1}>
                            Update
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="flex items-center gap-x-6">
                    <p className={cn("sm:text-lg", user?.name.length ? "" : "text-neutral-600")}>
                        {user?.name.length ? user.name : "Enter your name ...."}
                    </p>
                    <Button size="icon" variant="outline" className="rounded-full" onClick={() => setEdit(true)}>
                        <Pencil className="size-4 text-neutral-400" />
                    </Button>
                </div>
            )}
        </div>
    );
}
