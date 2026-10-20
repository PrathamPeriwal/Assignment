import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import type { UserSession } from '@/lib/types';

interface SessionSectionProps {
  title: string;
  sessions: UserSession[];
  empty: string;
  renderItem: (session: UserSession) => ReactNode;
}

const MAX_STAGGERED = 8;

export function SessionSection({ title, sessions, empty, renderItem }: SessionSectionProps) {
  const headingId = `${title.toLowerCase()}-heading`;

  return (
    <section aria-labelledby={headingId}>
      <div className="rule-b flex items-baseline justify-between gap-4 pb-3">
        <h2 id={headingId} className="font-display text-h2">
          {title}
        </h2>
        <p className="font-mono text-h3" aria-label={`${sessions.length} ${title.toLowerCase()}`}>
          {String(sessions.length).padStart(2, '0')}
        </p>
      </div>
      {sessions.length === 0 ? (
        <p className="mt-5 max-w-md text-ink-soft">{empty}</p>
      ) : (
        <ul className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(min(100%,19rem),1fr))] gap-x-6 gap-y-8">
          {sessions.map((session, index) => (
            <motion.li
              key={session._id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  type: 'spring',
                  stiffness: 380,
                  damping: 30,
                  delay: Math.min(index, MAX_STAGGERED) * 0.05,
                },
              }}
            >
              {renderItem(session)}
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  );
}
