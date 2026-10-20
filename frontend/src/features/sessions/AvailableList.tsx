import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import type { AvailableSession } from '@/lib/types';
import { useAvailableSessions } from './hooks';
import { NoSessionsDay } from './NoSessionsDay';
import { Timetable } from './Timetable';
import { TimetableSkeleton } from './TimetableSkeleton';
import { matchesQuery } from './slots';

interface AvailableListProps {
  day: Date;
  query: string;
  onSelectDay: (day: Date) => void;
  onClearQuery: () => void;
  onPick: (session: AvailableSession) => void;
}

export function AvailableList({
  day,
  query,
  onSelectDay,
  onClearQuery,
  onPick,
}: AvailableListProps) {
  const sessions = useAvailableSessions(day);

  if (sessions.isPending) return <TimetableSkeleton />;

  if (sessions.isError) {
    return (
      <ErrorState
        message={sessions.error.message}
        onRetry={() => void sessions.refetch()}
        retrying={sessions.isFetching}
      />
    );
  }

  if (sessions.data.length === 0) return <NoSessionsDay day={day} onSelectDay={onSelectDay} />;

  const visible = sessions.data.filter((session) => matchesQuery(session, query));

  if (visible.length === 0) {
    return (
      <EmptyState
        title="No match on this day"
        actions={<Button onClick={onClearQuery}>Clear the filter</Button>}
      >
        <p>
          {sessions.data.length} open {sessions.data.length === 1 ? 'slot' : 'slots'}, but none for
          &ldquo;{query.trim()}&rdquo;. Check the spelling, or try a subject instead of a name.
        </p>
      </EmptyState>
    );
  }

  return <Timetable key={day.getTime()} sessions={visible} onSelect={onPick} />;
}
