import { z } from 'zod';

export const email = z.string().trim().toLowerCase().pipe(z.email());

export const createUserBody = z.object({
  fullName: z.string().trim().min(1).max(100),
  email,
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ()-]{7,20}$/, 'Must be a valid phone number'),
});

export type CreateUserInput = z.infer<typeof createUserBody>;
