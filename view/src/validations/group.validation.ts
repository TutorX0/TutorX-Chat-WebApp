import { z } from "zod";

export const groupSchema = z.object({
    _id: z.string(),
    description: z.string(),
    groupName: z.string(),
    messageIds: z.array(z.string()),
    createdAt: z.string(),
    updatedAt: z.string(),
    __v: z.number()
});

export type GroupSchema = z.infer<typeof groupSchema>;

export const groupResponseSchema = z.object({
    status: z.string(),
    groups: z.array(groupSchema)
});

export type GroupResponseType = z.infer<typeof groupResponseSchema>;

export const groupCreationResponseSchema = z.object({
    message: z.string(),
    group: groupSchema
});

export type GroupCreationResponseType = z.infer<typeof groupCreationResponseSchema>;
