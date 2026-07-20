import { z } from 'zod';

export const userSchema = z.object({
  username: z.string().min(1),
});

export type User = z.infer<typeof userSchema>;
