import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components";
import { otpResponseSchema, otpSchema, type OtpType } from "@/validations";
import { axiosClient } from "@/lib";
import { useStore } from "@/store";

type OtpProps = {
    email: string;
};

export function Otp({ email }: OtpProps) {
    const otpForm = useForm<OtpType>({
        resolver: zodResolver(otpSchema),
        defaultValues: { pin: "" }
    });
    const setUser = useStore((state) => state.setUser);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function onOtpVerification(values: OtpType) {
        if (loading) return;

        setLoading(true);
        try {
            const response = await axiosClient.post("/verify-otp", { email, otp: values.pin });

            const parsedResponse = otpResponseSchema.safeParse(response.data);
            if (!parsedResponse.success) return toast.error("Invalid data type sent from server");

            window.localStorage.setItem("tutor-x-auth-token", parsedResponse.data.token);
            setUser(parsedResponse.data.user);

            toast.success(parsedResponse.data.message);
            navigate("/", { replace: true });
        } catch (error: unknown) {
            let message = "An unexpected error was returned from the server";
            if (error instanceof AxiosError) message = error?.response?.data?.message;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(onOtpVerification)} className="mx-auto mt-6 w-full max-w-md space-y-4 lg:mx-0">
                <FormField
                    control={otpForm.control}
                    name="pin"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                One Time Password {"("}Sent in email{")"}
                            </FormLabel>
                            <FormControl>
                                <InputOTP maxLength={6} {...field} className="bg-red-400">
                                    <InputOTPGroup className="w-full [&>*]:w-full">
                                        <InputOTPSlot
                                            index={0}
                                            autoFocus
                                            className="data-[active=true]:border-login-primary data-[active=true]:ring-login-primary border-login-primary border data-[active=true]:ring-1"
                                        />
                                        <InputOTPSlot
                                            index={1}
                                            className="data-[active=true]:border-login-primary data-[active=true]:ring-login-primary border-login-primary border border-l-transparent data-[active=true]:ring-1"
                                        />
                                        <InputOTPSlot
                                            index={2}
                                            className="data-[active=true]:border-login-primary data-[active=true]:ring-login-primary border-login-primary border border-l-transparent data-[active=true]:ring-1"
                                        />
                                    </InputOTPGroup>
                                    <InputOTPSeparator className="hidden sm:block" />
                                    <InputOTPGroup className="w-full [&>*]:w-full">
                                        <InputOTPSlot
                                            index={3}
                                            className="data-[active=true]:border-login-primary data-[active=true]:ring-login-primary border-login-primary border data-[active=true]:ring-1"
                                        />
                                        <InputOTPSlot
                                            index={4}
                                            className="data-[active=true]:border-login-primary data-[active=true]:ring-login-primary border-login-primary border border-l-transparent data-[active=true]:ring-1"
                                        />
                                        <InputOTPSlot
                                            index={5}
                                            className="data-[active=true]:border-login-primary data-[active=true]:ring-login-primary border-login-primary border border-l-transparent data-[active=true]:ring-1"
                                        />
                                    </InputOTPGroup>
                                </InputOTP>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex items-center justify-end">
                    <Button type="submit" loading={loading} className="bg-login-primary hover:bg-login-primary/90 text-white">
                        Submit
                    </Button>
                </div>
            </form>
        </Form>
    );
}
