import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { isApiError } from '@/lib/api-error';
import { useUser } from '@/features/users/hooks';
import { ActingAsContext, type ActingAsValue } from './context';
import { readActor, writeActor, type Actor } from './storage';
import { UserPicker } from './UserPicker';

export function ActingAsProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<Actor | null>(readActor);
  const [pickerOpen, setPickerOpen] = useState(false);
  const afterPick = useRef<(() => void) | null>(null);

  // A reseeded database leaves ids in localStorage that no longer exist
  const check = useUser(stored?.id ?? null);
  const stale = isApiError(check.error) && check.error.status === 404;
  const actor = stale ? null : stored;

  useEffect(() => {
    if (stale) writeActor(null);
  }, [stale]);

  const changePicker = useCallback((open: boolean) => {
    setPickerOpen(open);
    if (!open) afterPick.current = null;
  }, []);

  const value = useMemo<ActingAsValue>(
    () => ({
      actor,
      chooseUser: (user) => {
        const next = { id: user._id, fullName: user.fullName };
        writeActor(next);
        setStored(next);
        afterPick.current?.();
        afterPick.current = null;
      },
      clearActor: () => {
        writeActor(null);
        setStored(null);
      },
      openPicker: () => setPickerOpen(true),
      pickThen: (next) => {
        afterPick.current = next;
        setPickerOpen(true);
      },
    }),
    [actor],
  );

  return (
    <ActingAsContext value={value}>
      {children}
      <UserPicker open={pickerOpen} onOpenChange={changePicker} />
    </ActingAsContext>
  );
}
