import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '@/hooks/use-media-query';

export function TryOne() {
  const reduce = usePrefersReducedMotion();
  const draw = (delay: number, duration: number) => ({
    initial: reduce ? false : { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: { delay, duration, ease: 'easeOut' as const },
  });

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute -top-15 right-[6%] z-10 flex items-start gap-1 sm:right-[18%]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.3 } }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      <svg
        viewBox="0 0 72 90"
        className="mt-4 h-22 w-18 text-vermilion"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path d="M66 7c-14-3-31 1-41 13-8 10-11 34-10 64" {...draw(0.5, 0.7)} />
        <motion.path d="M7 74l8 11 7-11" {...draw(1.15, 0.2)} />
      </svg>
      <span className="font-display -rotate-6 text-h3 italic">try one</span>
    </motion.div>
  );
}
