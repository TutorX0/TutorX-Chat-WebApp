import { type Dispatch, type SetStateAction, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { z } from "zod";

import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@/components";

type UpdateEmailProps = {
    email: string;
};

export function UpdateEmail({ email }: UpdateEmailProps) {
    const [editEmail, setEditEmail] = useState(false);

    return (
        <div>
            {editEmail ? (
                <UpdateEmailForm setEditEmail={setEditEmail} email={email} />
            ) : (
                <>
                    <p className="text-sm text-neutral-400">E-mail</p>
                    <div className="flex justify-between gap-4">
                        <p className="flex-1">{email}</p>
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 rounded-full"
                            onClick={() => setEditEmail(true)}
                        >
                            <Pencil className="size-4 text-neutral-400" />
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}

const emailSchema = z.object({
    email: z.string().min(1, { message: "Please enter your e-mail" }).email({ message: "Please enter a valid e-mail" })
});

type EmailType = z.infer<typeof emailSchema>;

type UpdateEmailFormProps = {
    setEditEmail: Dispatch<SetStateAction<boolean>>;
    email: string;
};

export function UpdateEmailForm({ email, setEditEmail }: UpdateEmailFormProps) {
    const emailForm = useForm<EmailType>({
        resolver: zodResolver(emailSchema),
        defaultValues: { email }
    });

    function onEmailUpdate(values: EmailType) {
        console.log(values);
        // after the api call returns successfully
        setEditEmail(false);
    }

    return (
        <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onEmailUpdate)} className="w-full max-w-md space-y-4">
                <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-normal text-neutral-400">E-mail</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="Your e-mail" {...field} autoFocus />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex items-center justify-end">
                    <Button type="submit">Update</Button>
                </div>
            </form>
        </Form>
    );
}
