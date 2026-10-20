import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry: () => void;
  retrying?: boolean;
}

export function ErrorState({
  title = 'That did not load',
  message,
  onRetry,
  retrying,
}: ErrorStateProps) {
  return (
    <div role="alert" className="rule flex rounded-sm bg-paper">
      <span aria-hidden="true" className="w-2 shrink-0 bg-vermilion" />
      <div className="flex flex-col items-start gap-3 px-5 py-6 sm:px-8">
        <h2 className="font-display text-h3">{title}</h2>
        <p className="max-w-md text-ink-soft">{message}</p>
        <Button variant="secondary" onClick={onRetry} disabled={retrying}>
          {retrying ? 'Trying...' : 'Try again'}
        </Button>
      </div>
    </div>
  );
}
