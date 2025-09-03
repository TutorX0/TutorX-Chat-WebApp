import { useState, type Dispatch, type SetStateAction } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { z } from "zod";

import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@/components";
import { SelectCountryCode } from "./select-country-code";
import { addChatResponseSchema } from "@/validations";
import { useCountryList } from "@/hooks";
import { axiosClient } from "@/lib";
import { useStore } from "@/store";

const formSchema = z.object({
    number: z
        .string()
        .min(1, { message: "Please enter contact number" })
        .regex(/^\+?[0-9]*$/, "Only numbers and an optional '+' are allowed"),
    name: z.string().min(2, { message: "Please enter contact name" }),
    countryName: z.string().min(1, { message: "Please select a country" })
});

export type Form = z.infer<typeof formSchema>;

type NumberFormProps = {
    setOpen: Dispatch<SetStateAction<boolean>>;
};

export function NumberForm({ setOpen }: NumberFormProps) {
    const form = useForm<Form>({
        resolver: zodResolver(formSchema),
        defaultValues: { countryName: "", name: "", number: "" }
    });
    // form.setValue;
    const [loading, setLoading] = useState(false);
    const countryList = useCountryList();
    const addChat = useStore((state) => state.addChat);

    const country = countryList.find((country) => country.name === form.watch("countryName"));
    const callingCode = country?.callingCode;

    async function onSubmit(values: Form) {
        if (loading) return;

        setLoading(true);
        try {
            const phoneNumber = `${callingCode ? callingCode : ""}${values.number}`;

            const response = await axiosClient.post("/chat/create", { name: values.name, phoneNumber });

            const parsedResponse = addChatResponseSchema.safeParse(response.data);
            if (!parsedResponse.success) return toast.error("Invalid data type sent from server");

            addChat({
                _id: parsedResponse.data.chat._id,
                 chatId: parsedResponse.data.chat.chatId,
                 name: parsedResponse.data.chat.name,
                phoneNumber: parsedResponse.data.chat.phoneNumber,
                lastMessage: { 
                    content: "", 
                messageType: null, 
                timestamp: null, 
                status: "pending" // ✅ must include
},

                unreadCount: 0 // <--- add this
                });

            toast.success(parsedResponse.data.message);
            setOpen(false);
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
                <SelectCountryCode control={form.control} setValue={form.setValue} countryList={countryList} />
                <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-normal text-neutral-400">Enter contact number</FormLabel>
                            <div className="flex items-center">
                                {callingCode ? (
                                    <div className="border-input flex h-9 items-center rounded-l-md border border-r-0 px-2 text-xs">
                                        {callingCode}
                                    </div>
                                ) : null}
                                <FormControl>
                                    <Input
                                        inputMode="tel"
                                        pattern="^\+?[0-9]*$"
                                        placeholder="Example: 9988776655"
                                        className="rounded-l-none"
                                        {...field}
                                    />
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end">
                    <Button variant="secondary" type="submit" className="rounded-full">
                        Save Contact
                    </Button>
                </div>
            </form>
        </Form>
    );
}