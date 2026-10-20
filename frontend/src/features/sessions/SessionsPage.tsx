import { startOfDay } from 'date-fns';
import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { useActingAs } from '@/features/acting-as/context';
import { useDocumentTitle } from '@/hooks/use-document-title';
import type { AvailableSession } from '@/lib/types';
import { AvailableList } from './AvailableList';
import { BookDialog } from './BookDialog';
import { BrowseControls } from './BrowseControls';
import { formatLongDay } from './days';
import { WeekStrip } from './WeekStrip';

export function SessionsPage() {
  useDocumentTitle('Browse');
  const { actor, pickThen } = useActingAs();
  const [today] = useState(() => startOfDay(new Date()));
  const [day, setDay] = useState(today);
  const [query, setQuery] = useState('');
  const [target, setTarget] = useState<AvailableSession | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const pick = (session: AvailableSession) => {
    setTarget(session);
    if (actor) setConfirmOpen(true);
    else pickThen(() => setConfirmOpen(true));
  };

  return (
    <div>
      <PageHeader
        no={2}
        label="Browse"
        title={
          <>
            Open slots, <em>day by day.</em>
          </>
        }
      />

      <div className="mt-8 flex flex-col gap-5">
        <WeekStrip today={today} selected={day} onSelect={setDay} />
        <BrowseControls
          today={today}
          selected={day}
          onSelectDay={setDay}
          query={query}
          onQueryChange={setQuery}
        />
      </div>

      <h2 className="font-display mt-10 mb-4 text-h2">{formatLongDay(day)}</h2>
      <div className="min-h-80">
        <AvailableList
          day={day}
          query={query}
          onSelectDay={setDay}
          onClearQuery={() => setQuery('')}
          onPick={pick}
        />
      </div>

      <BookDialog session={target} open={confirmOpen} onOpenChange={setConfirmOpen} />
    </div>
  );
}
