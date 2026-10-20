import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-media-query';
import { subjects } from './copy';

const HOLD_MS = 2400;

export function RollingWord() {
  const reduce = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setIndex((value) => (value + 1) % subjects.length), HOLD_MS);
    return () => window.clearInterval(id);
  }, [reduce]);

  const word = subjects[reduce ? 0 : index];

  return (
    <span className="relative block overflow-hidden pr-[0.15em] pb-[0.08em] text-display">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.em
          key={word}
          className="block text-vermilion"
          initial={{ y: '105%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-105%' }}
          transition={{ type: 'spring', stiffness: 260, damping: 21, mass: 0.9 }}
        >
          {word}
        </motion.em>
      </AnimatePresence>
    </span>
  );
}
