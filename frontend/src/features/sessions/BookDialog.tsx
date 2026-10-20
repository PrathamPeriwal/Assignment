import { Dialog } from '@/components/ui/Dialog';
import { useActingAs } from '@/features/acting-as/context';
import type { AvailableSession } from '@/lib/types';
import { BookDialogBody } from './BookDialogBody';

interface BookDialogProps {
  session: AvailableSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookDialog({ session, open, onOpenChange }: BookDialogProps) {
  const { actor } = useActingAs();

  return (
    <Dialog
      open={open && actor !== null && session !== null}
      onOpenChange={onOpenChange}
      label="Confirm"
      title="Book this slot?"
    >
      {actor && session && (
        <BookDialogBody session={session} actor={actor} onClose={() => onOpenChange(false)} />
      )}
    </Dialog>
  );
}
