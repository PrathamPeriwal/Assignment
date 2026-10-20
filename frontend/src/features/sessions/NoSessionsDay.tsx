import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatLongDay } from './days';
import { useNextDayWithSessions } from './hooks';

interface NoSessionsDayProps {
  day: Date;
  onSelectDay: (day: Date) => void;
}

export function NoSessionsDay({ day, onSelectDay }: NoSessionsDayProps) {
  const next = useNextDayWithSessions(day, true);

  return (
    <EmptyState
      title="Nothing open on this day"
      actions={
        next.pending ? (
          <Skeleton className="h-11 w-56" />
        ) : next.day ? (
          <NextDayButton day={next.day} onSelectDay={onSelectDay} />
        ) : undefined
      }
    >
      {next.day || next.pending ? (
        <p>Every slot is taken or none were published. The next day with open slots is below.</p>
      ) : (
        <p>
          Nothing in the following week either. Try another day on the strip, or pick a date above.
        </p>
      )}
    </EmptyState>
  );
}

function NextDayButton({ day, onSelectDay }: NoSessionsDayProps) {
  return <Button onClick={() => onSelectDay(day)}>Go to {formatLongDay(day)}</Button>;
}
