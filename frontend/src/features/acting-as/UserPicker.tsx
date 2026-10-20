import { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { CreateUserForm } from './CreateUserForm';
import { UserList } from './UserList';

interface UserPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function PickerBody({ onDone }: { onDone: () => void }) {
  const [creating, setCreating] = useState(false);

  if (creating) {
    return <CreateUserForm onDone={onDone} onBack={() => setCreating(false)} />;
  }
  return <UserList onDone={onDone} onCreate={() => setCreating(true)} />;
}

export function UserPicker({ open, onOpenChange }: UserPickerProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Acting as"
      title="Who is this?"
      description="There are no logins. Pick yourself from the list, or add a new person."
    >
      <PickerBody onDone={() => onOpenChange(false)} />
    </Dialog>
  );
}
