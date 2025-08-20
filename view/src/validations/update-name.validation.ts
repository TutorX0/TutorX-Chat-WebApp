import { z } from "zod";

export const updateNameResponseSchema = z.object({
    status: z.string(),
    message: z.string(),
    chat: z.object({
        _id: z.string(),
        chatId: z.string(),
        phoneNumber: z.string(),
        name: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
        __v: z.number()
    })
});
