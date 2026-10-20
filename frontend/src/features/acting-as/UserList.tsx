import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/toast-context';
import { useUsers } from '@/features/users/hooks';
import { cn } from '@/lib/cn';
import type { User } from '@/lib/types';
import { useActingAs } from './context';

interface UserListProps {
  onDone: () => void;
  onCreate: () => void;
}

function Loading() {
  return (
    <div aria-busy="true" className="flex flex-col gap-3">
      <Skeleton className="h-14" />
      <Skeleton className="h-14" />
      <Skeleton className="h-14" />
    </div>
  );
}

export function UserList({ onDone, onCreate }: UserListProps) {
  const { actor, chooseUser, clearActor } = useActingAs();
  const toast = useToast();
  const users = useUsers();

  const pick = (user: User) => {
    chooseUser(user);
    toast({ title: `Acting as ${user.fullName}`, tone: 'success' });
    onDone();
  };

  if (users.isPending) return <Loading />;

  if (users.isError) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="border-l-[3px] border-vermilion pl-2">{users.error.message}</p>
        <Button variant="secondary" onClick={() => void users.refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  if (users.data.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p>Nobody is on the list yet. Add the first person and carry on from there.</p>
        <Button onClick={onCreate}>Add a person</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <ul className="rule-t">
        {users.data.map((user) => {
          const current = user._id === actor?.id;
          return (
            <li key={user._id} className="rule-b">
              <button
                type="button"
                aria-current={current || undefined}
                onClick={() => pick(user)}
                className={cn(
                  'flex w-full items-baseline justify-between gap-4 px-2 py-3 text-left',
                  'transition-[translate,background-color] duration-200 ease-spring',
                  'hover:bg-paper-2 active:translate-x-1',
                  current && 'bg-butter hover:bg-butter',
                )}
              >
                <span className="font-display text-xl">{user.fullName}</span>
                <span className="mono-label truncate text-ink-soft">{user.email}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={onCreate}>
          Add a person
        </Button>
        {actor && (
          <Button
            variant="ghost"
            onClick={() => {
              clearActor();
              onDone();
            }}
          >
            Stop acting as {actor.fullName}
          </Button>
        )}
      </div>
    </div>
  );
}
