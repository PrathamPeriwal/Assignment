import { z } from 'zod';

const schema = z.object({
  VITE_API_URL: z.url({ error: 'VITE_API_URL must be a full URL, e.g. http://localhost:3000' }),
});

const parsed = schema.safeParse(import.meta.env);

if (!parsed.success) {
  throw new Error(`Bad environment. Copy .env.example to .env. ${parsed.error.issues[0]?.message}`);
}

export const env = {
  apiUrl: parsed.data.VITE_API_URL.replace(/\/+$/, ''),
};
