import { z } from "zod";

export const emailSchema = z.object({
    email: z.string().min(1, { message: "Please enter your e-mail" }).email({ message: "Please enter a valid e-mail" })
});

export type EmailType = z.infer<typeof emailSchema>;

export const emailResponseSchema = z.object({
    message: z.string()
});
