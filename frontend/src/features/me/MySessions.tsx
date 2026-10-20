import { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { ErrorState } from '@/components/ui/ErrorState';
import { Ticket } from '@/components/ui/Ticket';
import { useUserSessions } from '@/features/sessions/hooks';
import type { UserSession } from '@/lib/types';
import { CompleteDialogBody } from './CompleteDialogBody';
import { MySessionsSkeleton } from './MySessionsSkeleton';
import { SessionSection } from './SessionSection';
import { UpcomingItem } from './UpcomingItem';

export function MySessions({ userId }: { userId: string }) {
  const sessions = useUserSessions(userId);
  const [target, setTarget] = useState<UserSession | null>(null);
  const [open, setOpen] = useState(false);

  if (sessions.isPending) return <MySessionsSkeleton />;

  if (sessions.isError) {
    return (
      <ErrorState
        message={sessions.error.message}
        onRetry={() => void sessions.refetch()}
        retrying={sessions.isFetching}
      />
    );
  }

  const { upcoming, completed } = sessions.data;

  return (
    <div className="flex flex-col gap-14">
      <SessionSection
        title="Upcoming"
        sessions={upcoming}
        empty="Nothing booked yet. Browse the open slots and your next one will show up here."
        renderItem={(session) => (
          <UpcomingItem
            session={session}
            onComplete={(chosen) => {
              setTarget(chosen);
              setOpen(true);
            }}
          />
        )}
      />
      <SessionSection
        title="Completed"
        sessions={completed}
        empty="No finished sessions yet. Completed ones get a DONE stamp and land here."
        renderItem={(session) => <Ticket session={session} variant="completed" />}
      />
      <Dialog
        open={open}
        onOpenChange={setOpen}
        label="Teacher action"
        title="Mark this session as completed?"
      >
        {target && <CompleteDialogBody session={target} onClose={() => setOpen(false)} />}
      </Dialog>
    </div>
  );
}
