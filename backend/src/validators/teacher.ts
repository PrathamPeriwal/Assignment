import { z } from 'zod';
import { email } from './user';

export const createTeacherBody = z.object({
  fullName: z.string().trim().min(1).max(100),
  email,
  specialization: z.string().trim().min(1).max(100),
  experience: z.number().min(0).max(70),
});

export type CreateTeacherInput = z.infer<typeof createTeacherBody>;
