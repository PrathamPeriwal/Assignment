import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { isApiError } from '@/lib/api-error';
import { useUser } from '@/features/users/hooks';
import { ActingAsContext, type ActingAsValue } from './context';
import { readActor, writeActor, type Actor } from './storage';
import { UserPicker } from './UserPicker';

export function ActingAsProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<Actor | null>(readActor);
  const [pickerOpen, setPickerOpen] = useState(false);

  // A reseeded database leaves ids in localStorage that no longer exist
  const check = useUser(stored?.id ?? null);
  const stale = isApiError(check.error) && check.error.status === 404;
  const actor = stale ? null : stored;

  useEffect(() => {
    if (stale) writeActor(null);
  }, [stale]);

  const value = useMemo<ActingAsValue>(
    () => ({
      actor,
      chooseUser: (user) => {
        const next = { id: user._id, fullName: user.fullName };
        writeActor(next);
        setStored(next);
      },
      clearActor: () => {
        writeActor(null);
        setStored(null);
      },
      openPicker: () => setPickerOpen(true),
    }),
    [actor],
  );

  return (
    <ActingAsContext value={value}>
      {children}
      <UserPicker open={pickerOpen} onOpenChange={setPickerOpen} />
    </ActingAsContext>
  );
}
