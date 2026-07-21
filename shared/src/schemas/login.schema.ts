import { z } from 'zod';

/**
 * Zod schema for the admin login request body.
 * Validates username and password for both the login form and the auth endpoint.
 */
export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(8),
});

export type LoginPayload = z.infer<typeof loginSchema>;
