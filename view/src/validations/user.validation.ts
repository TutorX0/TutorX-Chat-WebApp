import { z } from "zod";

export const userSchema = z.object({
    status: z.string(),
    user: z.object({
        id: z.string(),
        isVerified: z.boolean(),
        email: z.string().email({ message: "Please enter a valid e-mail" })
    })
});

export type UserSchemaType = z.infer<typeof userSchema>;
