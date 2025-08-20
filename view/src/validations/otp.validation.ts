import { z } from "zod";

export const otpSchema = z.object({
    pin: z.string().min(6, { message: "Your one-time password must be 6 characters" })
});

export type OtpType = z.infer<typeof otpSchema>;

export const otpResponseSchema = z.object({
    message: z.string(),
    token: z.string(),
    user: z.object({
        email: z.string().email(),
        id: z.string(),
        isVerified: z.boolean(),
        name: z.string(),
        about: z.string()
    })
});

export type UserType = z.infer<typeof otpResponseSchema.shape.user>;
