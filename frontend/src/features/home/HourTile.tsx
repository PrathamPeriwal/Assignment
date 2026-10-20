import {
  AnimatePresence,
  motion,
  useAnimate,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useEffect } from 'react';
import { Stamp } from '@/components/ui/Stamp';
import { usePrefersReducedMotion } from '@/hooks/use-media-query';
import { cn } from '@/lib/cn';
import { falloff, hourLabel, pad, tearTilt } from './strip';

interface HourTileProps {
  index: number;
  hour: number;
  booked: boolean;
  wobble: number;
  position: MotionValue<number>;
  focusable: boolean;
  onBook: () => void;
  onFocus: () => void;
  buttonRef: (node: HTMLButtonElement | null) => void;
}

const tear = { type: 'spring', stiffness: 420, damping: 15, mass: 0.8 } as const;

function takenSide(index: number) {
  const column = index % 5;
  if (column < 2) return 'left-0';
  if (column > 2) return 'right-0';
  return 'left-1/2 -translate-x-1/2';
}

export function HourTile({
  index,
  hour,
  booked,
  wobble,
  position,
  focusable,
  onBook,
  onFocus,
  buttonRef,
}: HourTileProps) {
  const reduce = usePrefersReducedMotion();
  const pull = useSpring(
    useTransform(position, (value) => falloff(value - index)),
    { stiffness: 380, damping: 30, mass: 0.5 },
  );
  const y = useTransform(pull, [0, 1], [0, -18]);
  const scale = useTransform(pull, [0, 1], [1, 1.1]);
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const tilt = tearTilt(index);

  useEffect(() => {
    if (wobble === 0 || reduce) return;
    void animate(scope.current, { rotate: [0, -6, 5, -3, 1, 0] }, { duration: 0.45 });
  }, [wobble, reduce, animate, scope]);

  return (
    <motion.div data-tile style={{ y, scale, originY: 1 }} className="relative will-change-transform">
      <button
        ref={buttonRef}
        type="button"
        tabIndex={focusable ? 0 : -1}
        aria-label={`${hourLabel(hour)}, ${booked ? 'booked' : 'open'}`}
        onClick={onBook}
        onFocus={onFocus}
        className={cn(
          'block w-full touch-manipulation rounded-sm text-left drop-shadow-hard select-none',
          'transition-[translate] duration-300 ease-spring focus-visible:-translate-y-1 active:translate-y-0.5',
        )}
      >
        <span ref={scope} className="block">
          <motion.span
            className="block rounded-t-sm bg-ink p-[1.5px] pb-0"
            style={{ originX: tilt < 0 ? 0 : 1, originY: 1 }}
            animate={booked ? { y: -10, x: tilt < 0 ? -2 : 2, rotate: tilt } : { y: 0, x: 0, rotate: 0 }}
            transition={reduce ? { duration: 0 } : tear}
          >
            <span className="relative flex h-28 flex-col justify-between bg-paper-2 p-2 sm:h-32 md:h-36 md:p-3">
              <span className="mono-label text-ink-soft">{pad(index + 1)}</span>
              <span className="font-mono text-2xl leading-none font-medium tracking-tight md:text-4xl">
                {pad(hour)}
                <span className="mt-1 block text-sm text-ink-soft md:text-base">:00</span>
              </span>
              {booked && (
                <span className="absolute inset-x-0 top-0 bottom-1/2 grid place-items-center">
                  <Stamp tone="vermilion" tilt={-78}>
                    Booked
                  </Stamp>
                </span>
              )}
            </span>
          </motion.span>
          <span className="block rounded-b-sm bg-ink p-[1.5px] pt-0">
            <span
              className={cn(
                'rule-t flex h-10 items-center justify-center border-dashed font-mono text-xs',
                booked ? 'bg-butter text-ink' : 'bg-paper-2 text-ink-soft',
              )}
            >
              60m
            </span>
          </span>
        </span>
      </button>

      <AnimatePresence>
        {wobble > 0 && (
          <motion.span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute -top-10 z-10 rounded-sm bg-ink px-2 py-1 font-mono text-xs whitespace-nowrap text-paper',
              takenSide(index),
            )}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            already taken
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
