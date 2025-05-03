import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@/components";

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

    function onSubmit(values: Form) {
        console.log(values);
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
