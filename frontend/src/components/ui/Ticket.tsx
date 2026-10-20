import { cn } from '@/lib/cn';
import { formatDay, formatStamp, formatTime, shortId } from '@/lib/format';
import type { AvailableSession, UserSession } from '@/lib/types';
import { Stamp } from './Stamp';
import { TicketShell } from './TicketShell';

export type TicketVariant = 'available' | 'booked' | 'completed';

interface TicketProps {
  session: AvailableSession | UserSession;
  variant: TicketVariant;
  onSelect?: (session: AvailableSession) => void;
  className?: string;
}

const lift =
  'drop-shadow-hard transition-[translate,filter] duration-300 ease-spring ' +
  'hover:-translate-x-0.5 hover:-translate-y-1 hover:drop-shadow-hard-lg ' +
  'active:translate-x-1 active:translate-y-1 active:drop-shadow-press';

const surfaces: Record<TicketVariant, string> = {
  available: 'bg-paper-2',
  booked: 'bg-paper-2',
  completed: 'bg-paper text-ink-soft',
};

function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 10" className="h-2.5 w-4">
      <path d="M0 5h14M10 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function Main({ session, variant }: Pick<TicketProps, 'session' | 'variant'>) {
  const { teacher, startTime, endTime } = session;
  const completedAt = 'completedAt' in session ? session.completedAt : null;

  return (
    <>
      <span className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-2xl font-medium tracking-tight">
          <time dateTime={startTime} className={cn(variant === 'booked' && 'bg-butter px-1 -mx-1')}>
            {formatTime(startTime)}
          </time>
          <time dateTime={endTime} className="ml-1.5 text-sm font-normal text-ink-soft">
            to {formatTime(endTime)}
          </time>
        </span>
        <span className="mono-label shrink-0 text-ink-soft">{formatDay(startTime)}</span>
      </span>
      <span className="font-display mt-4 block text-h3 text-balance">{teacher.fullName}</span>
      <span className="mono-label mt-2 block text-ink-soft">
        {teacher.specialization} / {teacher.experience} yrs
      </span>
      {variant === 'completed' && completedAt && (
        <span className="mono-label mt-3 block text-moss">Done {formatStamp(completedAt)}</span>
      )}
    </>
  );
}

function Stub({ session, variant }: Pick<TicketProps, 'session' | 'variant'>) {
  return (
    <>
      <span className="mono-label">
        {session.durationMinutes} min
        <span className="ml-3 text-ink-soft">#{shortId(session._id)}</span>
      </span>
      {variant === 'available' && (
        <span className="mono-label flex items-center gap-2 text-ink">
          Book
          <Arrow />
        </span>
      )}
      {variant === 'booked' && <Stamp tone="vermilion">Booked</Stamp>}
      {variant === 'completed' && <Stamp tone="moss">Done</Stamp>}
    </>
  );
}

export function Ticket({ session, variant, onSelect, className }: TicketProps) {
  const shell = (
    <TicketShell
      surface={surfaces[variant]}
      main={<Main session={session} variant={variant} />}
      stub={<Stub session={session} variant={variant} />}
    />
  );

  if (variant === 'available' && onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(session)}
        className={cn('block w-full rounded-sm text-left', lift, className)}
      >
        {shell}
      </button>
    );
  }

  return (
    <article
      className={cn(variant !== 'completed' ? 'drop-shadow-hard' : 'drop-shadow-press', className)}
    >
      {shell}
    </article>
  );
}
