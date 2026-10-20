import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'vermilion' | 'moss' | 'ink';

interface StampProps {
  tone?: Tone;
  tilt?: number;
  className?: string;
  children: ReactNode;
}

const tones: Record<Tone, string> = {
  vermilion: 'border-ink bg-vermilion text-ink',
  moss: 'border-moss text-moss',
  ink: 'border-ink text-ink',
};

export function Stamp({ tone = 'ink', tilt = -6, className, children }: StampProps) {
  return (
    <motion.span
      className={cn(
        'mono-label inline-block rounded-sm border-2 px-2 py-1 font-bold select-none',
        tones[tone],
        className,
      )}
      style={{ rotate: tilt }}
      initial={{ opacity: 0, scale: 1.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 520, damping: 26 }}
    >
      {children}
    </motion.span>
  );
}
