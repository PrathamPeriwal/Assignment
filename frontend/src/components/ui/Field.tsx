import { useId, type ReactNode } from 'react';

interface ControlProps {
  id: string;
  'aria-describedby': string | undefined;
  'aria-invalid': true | undefined;
}

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  children: (control: ControlProps) => ReactNode;
}

export function Field({ label, hint, error, children }: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ');

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="mono-label text-ink">
        {label}
      </label>
      {children({
        id,
        'aria-describedby': describedBy || undefined,
        'aria-invalid': error ? true : undefined,
      })}
      {hint && (
        <p id={hintId} className="text-sm text-ink-soft">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="border-l-[3px] border-vermilion pl-2 text-sm text-ink"
        >
          {error}
        </p>
      )}
    </div>
  );
}
