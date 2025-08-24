import { AxiosError } from "axios";
import { useEffect } from "react";
import { toast } from "sonner";

import { groupResponseSchema } from "@/validations";
import { axiosClient } from "@/lib";
import { useStore } from "@/store";

export function useFetchGroups() {
    const groups = useStore((state) => state.groups);
    const setGroups = useStore((state) => state.setGroups);

    useEffect(() => {
        async function getGroups() {
            if (groups) return;

            try {
                const response = await axiosClient.get("/group/groups");

                const parsedResponse = groupResponseSchema.safeParse(response.data);
                if (!parsedResponse.success) return toast.error("Invalid data type sent from server");

                setGroups(parsedResponse.data.groups);
            } catch (error: unknown) {
                let message = "An unexpected error was returned from the server";
                if (error instanceof AxiosError) message = error?.response?.data?.message;
                toast.error(message);
            }
        }

        getGroups();
    }, []);
}