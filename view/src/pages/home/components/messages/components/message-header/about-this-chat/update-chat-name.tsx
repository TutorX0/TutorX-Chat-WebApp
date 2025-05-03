import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { z } from "zod";

import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@/components";
import { updateNameResponseSchema, type ChatItem } from "@/validations";
import { axiosClient } from "@/lib";
import { useStore } from "@/store";

const formSchema = z.object({
    username: z.string().min(2)
});

type FormSchema = z.infer<typeof formSchema>;

export function UpdateChatName({ phoneNumber, name }: Pick<ChatItem, "phoneNumber" | "name">) {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: { username: name }
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        form.setValue("username", name);
    }, [name]);

    const updateChatname = useStore((state) => state.updateChatName);

    async function onSubmit(values: FormSchema) {
        if (loading) return;

        setLoading(true);
        try {
            const response = await axiosClient.put("/chat/update", { phoneNumber, newName: values.username });

            const parsedResponse = updateNameResponseSchema.safeParse(response.data);
            if (!parsedResponse.success) return toast.error("Invalid data type sent from server");

            updateChatname({ newChatName: values.username, phoneNumber });
            toast.success(parsedResponse.data.message);
        } catch (error: unknown) {
            let message = "An unexpected error was returned from the server";
            if (error instanceof AxiosError) message = error?.response?.data?.message;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mb-10 space-y-4">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                        Submit
                    </Button>
                </div>
            </form>
        </Form>
    );
}
