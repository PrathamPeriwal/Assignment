import { SectionLabel } from '@/components/ui/SectionLabel';

// Placeholder. The next phase replaces this whole component.
export function Hero() {
  return (
    <section>
      <SectionLabel no={1}>Office hours</SectionLabel>
      <h1 className="font-display mt-6 text-display text-balance">
        Pick a day. <em className="text-vermilion">Take a seat.</em>
      </h1>
      <p className="mt-6 max-w-xl text-lead text-ink-soft">
        Teachers keep short, open slots. Find one that suits you, book it, and it turns up under My
        sessions.
      </p>
    </section>
  );
}
