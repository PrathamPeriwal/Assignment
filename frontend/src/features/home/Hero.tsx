import { SectionLabel } from '@/components/ui/SectionLabel';
import { DayStrip } from './DayStrip';
import { LiveLine } from './LiveLine';
import { RollingWord } from './RollingWord';

export function Hero() {
  return (
    <section aria-labelledby="hero-heading">
      <SectionLabel no={1}>Office hours</SectionLabel>
      <div className="mt-6 grid gap-x-8 gap-y-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <h1 id="hero-heading" className="font-display text-h1">
            <span className="sr-only">Book an hour with someone who has done it.</span>
            <span aria-hidden="true">
              <span className="block">Book an hour of</span>
              <RollingWord />
              <span className="block text-balance">with someone who&rsquo;s done it.</span>
            </span>
          </h1>
          <p className="mono-label mt-6 text-ink-soft">
            A practice day below. Claim a few hours, nothing is saved.
          </p>
        </div>
        <div className="md:col-span-4 md:pb-1">
          <p className="max-w-sm text-lead text-ink-soft">
            Teachers keep short, open hours. Pick one that suits you, book it, and turn up.
          </p>
          <LiveLine />
        </div>
      </div>
      <DayStrip />
    </section>
  );
}
