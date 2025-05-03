import { z } from "zod";

import { chatSchema } from "./chats.validation";

export const updateNameResponseSchema = z.object({
    status: z.string(),
    message: z.string(),
    chat: chatSchema
});
