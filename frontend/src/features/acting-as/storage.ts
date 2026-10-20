import { z } from 'zod';

const KEY = 'office-hours:acting-as';

const actorSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/),
  fullName: z.string().min(1),
});

export type Actor = z.infer<typeof actorSchema>;

export function readActor(): Actor | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = actorSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function writeActor(actor: Actor | null) {
  try {
    if (actor) localStorage.setItem(KEY, JSON.stringify(actor));
    else localStorage.removeItem(KEY);
  } catch {
    // storage can be blocked (private mode, quota); the app still works for this tab
  }
}
