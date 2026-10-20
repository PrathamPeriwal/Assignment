import { Button } from '@/components/ui/Button';
import { Ticket } from '@/components/ui/Ticket';
import type { UserSession } from '@/lib/types';

interface UpcomingItemProps {
  session: UserSession;
  onComplete: (session: UserSession) => void;
}

export function UpcomingItem({ session, onComplete }: UpcomingItemProps) {
  return (
    <div className="flex flex-col gap-4">
      <Ticket session={session} variant="booked" />
      <div className="rule-t flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-3">
        <p className="mono-label max-w-44 text-ink-soft">Teacher action, kept here for the demo</p>
        <Button
          variant="secondary"
          size="sm"
          aria-label={`Mark session with ${session.teacher.fullName} as completed`}
          onClick={() => onComplete(session)}
        >
          Mark as completed
        </Button>
      </div>
    </div>
  );
}
