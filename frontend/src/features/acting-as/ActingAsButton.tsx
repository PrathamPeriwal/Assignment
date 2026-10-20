import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { useActingAs } from './context';

export function ActingAsButton({ className }: { className?: string }) {
  const { actor, openPicker } = useActingAs();

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={openPicker}
      aria-haspopup="dialog"
      className={cn('max-w-full min-w-0', className)}
    >
      <span className="mono-label font-normal text-ink-soft">Acting as:</span>
      <span className="truncate">{actor ? actor.fullName : 'nobody yet'}</span>
    </Button>
  );
}
