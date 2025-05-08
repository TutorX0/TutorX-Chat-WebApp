import { useState, type Dispatch, type SetStateAction } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@/components";
import { emailResponseSchema, emailSchema, type EmailType } from "@/validations";
import { axiosClient } from "@/lib";

type EmailProps = {
    emailSent: boolean;
    setEmail: Dispatch<SetStateAction<string>>;
    setEmailSent: Dispatch<SetStateAction<boolean>>;
};

export function Email({ emailSent, setEmail, setEmailSent }: EmailProps) {
    const emailForm = useForm<EmailType>({
        resolver: zodResolver(emailSchema),
        defaultValues: { email: "" }
    });
    const [loading, setLoading] = useState(false);

    async function onEmailLogin(values: EmailType) {
        if (emailSent || loading) return;

        setLoading(true);
        try {
            const response = await axiosClient.post("/user/send-otp", values);

            const parsedResponse = emailResponseSchema.safeParse(response.data);
            if (!parsedResponse.success) return toast.error("Invalid data type sent from server");

            setEmail(() => values.email);
            toast.success(parsedResponse.data.message);
            setEmailSent(true);
        } catch (error: unknown) {
            let message = "An unexpected error was returned from the server";
            if (error instanceof AxiosError) message = error?.response?.data?.message;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onEmailLogin)} className="mx-auto w-full max-w-md space-y-4 lg:mx-0">
                <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="Your e-mail"
                                    {...field}
                                    disabled={emailSent}
                                    autoFocus
                                    className="border-login-primary focus-visible:border-login-primary focus-visible:ring-login-primary border focus-visible:ring-1"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {emailSent ? null : (
                    <div className="flex items-center justify-end">
                        <Button type="submit" loading={loading} className="bg-login-primary hover:bg-login-primary/90 text-white">
                            Login
                        </Button>
                    </div>
                )}
            </form>
        </Form>
    );
}
