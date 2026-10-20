import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FormError } from '@/components/ui/FormError';
import { useToast } from '@/components/ui/toast-context';
import { useCompleteSession } from '@/features/sessions/hooks';
import { isApiError } from '@/lib/api-error';
import { formatDay, formatTime } from '@/lib/format';
import type { UserSession } from '@/lib/types';

interface CompleteDialogBodyProps {
  session: UserSession;
  onClose: () => void;
}

export function CompleteDialogBody({ session, onClose }: CompleteDialogBodyProps) {
  const complete = useCompleteSession();
  const toast = useToast();
  const [error, setError] = useState<string>();
  const { teacher, startTime } = session;

  const confirm = async () => {
    setError(undefined);
    try {
      await complete.mutateAsync(session._id);
    } catch (failure) {
      setError(isApiError(failure) ? failure.message : 'Could not update the session. Try again.');
      return;
    }
    toast({
      title: 'Marked as completed',
      description: `${teacher.fullName}, ${formatDay(startTime)} at ${formatTime(startTime)}`,
      tone: 'success',
    });
    onClose();
  };

  return (
    <div className="flex flex-col gap-4">
      <p>
        <strong>{teacher.fullName}</strong>, {formatDay(startTime)} at {formatTime(startTime)}.
      </p>
      <p className="text-ink-soft">
        In real life the teacher does this once the hour is over. It lives on this page only so you
        can walk through the whole flow.
      </p>
      <FormError>{error}</FormError>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => void confirm()} disabled={complete.isPending}>
          {complete.isPending ? 'Saving...' : 'Mark as completed'}
        </Button>
        <Button variant="ghost" onClick={onClose} disabled={complete.isPending}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
