import { format, parse } from 'date-fns';
import { z } from 'zod';

export const teacherSchema = z.object({
  fullName: z.string().trim().min(1, 'Enter a name').max(100, 'Keep it under 100 characters'),
  email: z.string().trim().pipe(z.email('Enter a valid email address')),
  specialization: z
    .string()
    .trim()
    .min(1, 'Enter what they teach')
    .max(100, 'Keep it under 100 characters'),
  experience: z
    .number({ error: 'Enter the years of experience' })
    .int('Use whole years')
    .min(0, 'Cannot be negative')
    .max(70, 'Keep it at 70 or under'),
});

export type TeacherValues = z.infer<typeof teacherSchema>;

export const sessionSchema = z
  .object({
    date: z.string().min(1, 'Pick a date'),
    start: z.string().min(1, 'Pick a start time'),
    end: z.string().min(1, 'Pick an end time'),
  })
  .refine((values) => !values.start || !values.end || values.end > values.start, {
    message: 'End time must be after the start time',
    path: ['end'],
  });

export type SessionValues = z.infer<typeof sessionSchema>;

export function toIso(date: string, time: string) {
  return parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm', new Date()).toISOString();
}

export const todayInput = () => format(new Date(), 'yyyy-MM-dd');
