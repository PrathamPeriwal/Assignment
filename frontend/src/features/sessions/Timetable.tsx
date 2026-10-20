import { AnimatePresence, motion } from 'motion/react';
import { Ticket } from '@/components/ui/Ticket';
import { formatTime } from '@/lib/format';
import type { AvailableSession } from '@/lib/types';
import { groupByStart } from './slots';
import { slotGrid, slotRow } from './timetable-styles';

interface TimetableProps {
  sessions: AvailableSession[];
  onSelect: (session: AvailableSession) => void;
}

const MAX_STAGGERED = 12;

export function Timetable({ sessions, onSelect }: TimetableProps) {
  return (
    <ol className="rule-t">
      <AnimatePresence>
        {groupByStart(sessions).map((group) => (
          <motion.li
            key={group.startTime}
            layout
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className={slotRow}
          >
            <p className="font-mono text-xl font-medium md:pt-1">
              <time dateTime={group.startTime}>{formatTime(group.startTime)}</time>
              <span className="mono-label block text-ink-soft">{group.sessions.length} open</span>
            </p>
            <ul className={slotGrid}>
              <AnimatePresence mode="popLayout">
                {group.sessions.map((session, index) => (
                  <motion.li
                    key={session._id}
                    layout
                    initial={{ opacity: 0, y: 18 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                        delay: Math.min(group.offset + index, MAX_STAGGERED) * 0.05,
                      },
                    }}
                    exit={{ opacity: 0, scale: 0.94, rotate: 2 }}
                  >
                    <Ticket session={session} variant="available" onSelect={onSelect} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </motion.li>
        ))}
      </AnimatePresence>
    </ol>
  );
}
