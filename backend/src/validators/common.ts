import { z } from 'zod';

export const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Must be a valid ObjectId');

export const idParams = z.object({ id: objectId });
export type IdParams = z.infer<typeof idParams>;
