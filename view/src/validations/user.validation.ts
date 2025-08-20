import { z } from "zod";

export const userSchema = z.object({
    status: z.string(),
    user: z.object({
        id: z.string(),
        isVerified: z.boolean(),
        email: z.string().email({ message: "Please enter a valid e-mail" }),
        name: z.string(),
        about: z.string()
    })
});

export type UserSchemaType = z.infer<typeof userSchema>;

export const updateUserFields = z.object({
    message: z.string(),
    user: z.object({
        __v: z.number(),
        _id: z.string(),
        isVerified: z.boolean(),
        email: z.string().email({ message: "Please enter a valid e-mail" }),
        name: z.string(),
        about: z.string()
    })
});

export type UpdateUserFieldsType = z.infer<typeof updateUserFields>;
