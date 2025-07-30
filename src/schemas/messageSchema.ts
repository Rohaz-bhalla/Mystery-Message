import { z } from 'zod'

export const MessageSchema = z.object ({
    content : z
    .string()
    .min(10, {message : 'Content must have more than 10 letters'})
    .max(300, {message : 'Content must not have more than 300 letters'})
});