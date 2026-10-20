import { startOfDay } from 'date-fns';
import { AnimatePresence, motion, useAnimate } from 'motion/react';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router';
import { buttonStyles } from '@/components/ui/button-styles';
import { formatLongDay } from '@/features/sessions/days';
import { useMediaQuery, usePrefersReducedMotion } from '@/hooks/use-media-query';
import { HourTile } from './HourTile';
import { claimed, HOURS, hourLabel, pad } from './strip';
import { TryOne } from './TryOne';
import { useStripPointer } from './use-strip-pointer';

const TAKEN_MS = 1800;
const LAST = HOURS.length - 1;

interface Taken {
  index: number;
  nonce: number;
}

export function DayStrip() {
  const reduce = usePrefersReducedMotion();
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)');
  const wide = useMediaQuery('(min-width: 40rem)');
  const pointer = useStripPointer({ follow: fine, magnify: fine && wide && !reduce });
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [today] = useState(() => startOfDay(new Date()));
  const [booked, setBooked] = useState<ReadonlySet<number>>(() => new Set());
  const [taken, setTaken] = useState<Taken | null>(null);
  const [active, setActive] = useState(0);
  const [started, setStarted] = useState(false);
  const [message, setMessage] = useState('');
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const takenTimer = useRef(0);

  useEffect(() => () => window.clearTimeout(takenTimer.current), []);

  const book = (index: number, hour: number) => {
    setStarted(true);
    if (booked.has(index)) {
      setTaken((prev) => ({ index, nonce: (prev?.nonce ?? 0) + 1 }));
      setMessage(`${hourLabel(hour)} is already taken.`);
      window.clearTimeout(takenTimer.current);
      takenTimer.current = window.setTimeout(() => setTaken(null), TAKEN_MS);
      return;
    }
    setBooked((prev) => new Set(prev).add(index));
    setMessage(`${hourLabel(hour)} booked. ${claimed(booked.size + 1)}`);
    if (!reduce) {
      void animate(
        scope.current,
        { x: [0, -3, 2, -1, 0], y: [0, 2, -1, 0] },
        { duration: 0.3, delay: 0.08 },
      );
    }
  };

  const reset = () => {
    buttons.current[active]?.focus();
    setBooked(new Set());
    setTaken(null);
    setMessage(`Day reset. ${claimed(0)}`);
  };

  const move = (event: KeyboardEvent<HTMLDivElement>) => {
    const targets: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: LAST,
    };
    const target = targets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    const next = Math.min(Math.max(target, 0), LAST);
    setActive(next);
    buttons.current[next]?.focus();
  };

  return (
    <div className="relative mt-20 md:mt-24">
      <AnimatePresence>{!started && <TryOne />}</AnimatePresence>

      <div className="rule-b flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pb-3">
        <p className="mono-label text-ink-soft">
          <span className="text-ink">Today</span> / {formatLongDay(today)}
        </p>
        <p className="mono-label text-ink-soft">08:00 to 18:00</p>
      </div>

      <div ref={scope}>
        <div className="relative pt-12 sm:pt-10" {...pointer.handlers}>
          <div
            role="toolbar"
            aria-label="Practice hours for today"
            aria-orientation="horizontal"
            onKeyDown={move}
            className="grid grid-cols-5 gap-x-2 gap-y-12 sm:grid-cols-10 md:gap-x-3"
          >
            {HOURS.map((hour, index) => (
              <HourTile
                key={hour}
                index={index}
                hour={hour}
                booked={booked.has(index)}
                wobble={taken?.index === index ? taken.nonce : 0}
                position={pointer.position}
                focusable={index === active}
                onBook={() => book(index, hour)}
                onFocus={() => setActive(index)}
                buttonRef={(node) => {
                  buttons.current[index] = node;
                }}
              />
            ))}
          </div>
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 z-20 -translate-x-1/2 -translate-y-[calc(100%+0.75rem)] rounded-sm bg-ink px-2 py-1 font-mono text-xs whitespace-nowrap text-paper"
            style={pointer.label}
          >
            pick an hour
          </motion.span>
        </div>
      </div>

      <div className="rule-t mt-8 flex min-h-22 flex-wrap items-center gap-x-8 gap-y-4 pt-5">
        <p aria-hidden="true" className="flex items-baseline gap-2.5">
          <span className="inline-block overflow-hidden font-mono text-h3 font-medium">
            <motion.span
              key={booked.size}
              className="inline-block"
              initial={{ y: '-70%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            >
              {pad(booked.size)}
            </motion.span>
          </span>
          <span className="text-ink-soft">of {HOURS.length} hours claimed</span>
        </p>
        {booked.size > 0 && (
          <button
            type="button"
            onClick={reset}
            className="mono-label min-h-11 underline decoration-[1.5px] underline-offset-4 transition-colors hover:decoration-vermilion"
          >
            Reset the day
          </button>
        )}
        <AnimatePresence>
          {started && (
            <motion.div
              className="sm:ml-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            >
              <Link to="/sessions" className={buttonStyles('primary', 'lg')}>
                Do it for real
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
        <p role="status" className="sr-only">
          {message}
        </p>
      </div>
    </div>
  );
}
