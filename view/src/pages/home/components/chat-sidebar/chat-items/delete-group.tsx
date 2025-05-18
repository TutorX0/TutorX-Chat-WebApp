import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components";
import { useUpdateSearchParam } from "@/hooks";
import { axiosClient } from "@/lib";
import { useStore } from "@/store";

type DeleteGroupProps = {
    chatType: string | null;
};

export function DeleteGroup({ chatType }: DeleteGroupProps) {
    const [loading, setLoading] = useState(false);
    const removeGroupByName = useStore((state) => state.removeGroupByName);
    const updateSearchParam = useUpdateSearchParam();

    async function deleteGroup() {
        if (loading || !chatType) return;

        setLoading(true);
        try {
            const response = await axiosClient.put(`/group/remove-group/${chatType}`);

            removeGroupByName(chatType);
            toast.success(response.data.message);
            updateSearchParam("chat_type", "chats");
        } catch (error: unknown) {
            let message = "An unexpected error was returned from the server";
            if (error instanceof AxiosError) message = error?.response?.data?.message;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <p className="max-w-[30ch] text-center text-sm">
                    <span className="text-neutral-400">If this group has served its purpose, delete it from </span>
                    <span className="cursor-pointer text-green-500">here</span>
                </p>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        <span className="font-semibold text-neutral-300">This action is irreversible.</span> Deleting this group
                        will permanently remove it. However, all chats will remain accessible in the{" "}
                        <span className="font-semibold text-neutral-300">Chats</span> section.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={loading} onClick={deleteGroup}>
                        Delete Group
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
