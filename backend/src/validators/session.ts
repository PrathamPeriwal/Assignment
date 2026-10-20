import { z } from 'zod';
import { objectId } from './common';

const isoDate = z.iso.datetime({ offset: true }).transform((value) => new Date(value));

export const createSessionBody = z
  .object({
    teacherId: objectId,
    startTime: isoDate,
    endTime: isoDate,
  })
  .refine((body) => body.endTime > body.startTime, {
    message: 'endTime must be after startTime',
    path: ['endTime'],
  });

export const availableQuery = z.object({
  dateTimestamp: z
    .string({ error: 'dateTimestamp is required' })
    .regex(/^\d+$/, 'Must be epoch milliseconds')
    .transform(Number)
    .pipe(z.number().max(8.64e15)),
  tzOffsetMinutes: z
    .string()
    .regex(/^-?\d+$/, 'Must be an integer')
    .transform(Number)
    .pipe(z.number().min(-840).max(840))
    .default(0),
});

export const bookBody = z.object({ userId: objectId });

export type CreateSessionInput = z.infer<typeof createSessionBody>;
export type AvailableQuery = z.infer<typeof availableQuery>;
export type BookInput = z.infer<typeof bookBody>;
