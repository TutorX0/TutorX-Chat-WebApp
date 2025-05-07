import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@/components";
import { axiosClient } from "@/lib";

const formSchema = z.object({
    number: z
        .string()
        .min(1, { message: "Please enter contact number" })
        .regex(/^\+?[0-9]*$/, "Only numbers and an optional '+' are allowed"),
    name: z.string().min(2, { message: "Please enter contact name" })
});

type Form = z.infer<typeof formSchema>;

export function NumberForm() {
    const form = useForm<Form>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", number: "" }
    });
    const [loading, setLoading] = useState(false);

    async function onSubmit(values: Form) {
        if (loading) return;

        setLoading(true);
        try {
            const response = await axiosClient.post("/chat/create", { name: values.name, phoneNumber: values.number });
            console.log(response);

            // const parsedResponse = emailResponseSchema.safeParse(response.data);
            // if (!parsedResponse.success) return toast.error("Invalid data type sent from server");

            // toast.success(parsedResponse.data.message);
            // setEmailSent(true);
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-3 space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-normal text-neutral-400">Enter contact name</FormLabel>
                            <FormControl>
                                <Input placeholder="Example: John Doe" {...field} autoFocus />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-normal text-neutral-400">Enter contact number</FormLabel>
                            <FormControl>
                                <Input inputMode="tel" pattern="^\+?[0-9]*$" placeholder="Example: 9988776655" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end">
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Form>
    );
}
