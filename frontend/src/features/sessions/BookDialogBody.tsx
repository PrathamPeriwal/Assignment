import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FormError } from '@/components/ui/FormError';
import { Stamp } from '@/components/ui/Stamp';
import { useToast } from '@/components/ui/toast-context';
import type { Actor } from '@/features/acting-as/storage';
import { isApiError, isConflict } from '@/lib/api-error';
import { formatDay, formatTime } from '@/lib/format';
import type { AvailableSession } from '@/lib/types';
import { useBookSession } from './hooks';

interface BookDialogBodyProps {
  session: AvailableSession;
  actor: Actor;
  onClose: () => void;
}

const STAMP_HOLD_MS = 1000;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function Row({ term, children }: { term: string; children: string }) {
  return (
    <div className="rule-b grid gap-1 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
      <dt className="mono-label pt-1 text-ink-soft">{term}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export function BookDialogBody({ session, actor, onClose }: BookDialogBodyProps) {
  const book = useBookSession();
  const toast = useToast();
  const [error, setError] = useState<string>();
  const [stamped, setStamped] = useState(false);
  const { teacher, startTime, endTime } = session;

  const confirm = async () => {
    setError(undefined);
    try {
      await book.mutateAsync({ sessionId: session._id, userId: actor.id });
    } catch (failure) {
      if (isConflict(failure)) {
        toast({
          title: 'Someone just took this one',
          description: 'The list is refreshed. Pick another slot.',
          tone: 'error',
        });
        onClose();
      } else {
        setError(isApiError(failure) ? failure.message : 'Could not book. Try again.');
      }
      return;
    }
    toast({
      title: 'Booked',
      description: `${teacher.fullName}, ${formatDay(startTime)} at ${formatTime(startTime)}`,
      tone: 'success',
    });
    setStamped(true);
    await wait(STAMP_HOLD_MS);
    onClose();
  };

  return (
    <div>
      <dl className="rule-t">
        <Row term="Teacher">{`${teacher.fullName}, ${teacher.specialization}`}</Row>
        <Row term="When">
          {`${formatDay(startTime)}, ${formatTime(startTime)} to ${formatTime(endTime)} (${session.durationMinutes} min)`}
        </Row>
        <Row term="Booking as">{actor.fullName}</Row>
      </dl>
      <div className="mt-5 flex min-h-12 flex-col gap-3">
        <FormError>{error}</FormError>
        {stamped ? (
          <div className="flex items-center gap-4">
            <Stamp tone="vermilion" tilt={-7} className="text-base">
              Booked
            </Stamp>
            <p className="text-ink-soft">It is under My sessions.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => void confirm()} disabled={book.isPending}>
              {book.isPending ? 'Booking...' : 'Confirm booking'}
            </Button>
            <Button variant="ghost" onClick={onClose} disabled={book.isPending}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
