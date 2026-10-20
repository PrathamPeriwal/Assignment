import type { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form';
import { isApiError } from './api-error';

interface Options<T extends FieldValues> {
  fields: Partial<Record<string, FieldPath<T>>>;
  conflictAt?: FieldPath<T>;
  conflictMessage?: string;
}

export function applyApiError<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  { fields, conflictAt, conflictMessage }: Options<T>,
) {
  if (!isApiError(error)) {
    setError('root', { message: 'Could not save. Try again.' });
    return;
  }

  if (error.status === 409) {
    const message = conflictMessage ?? error.message;
    if (conflictAt) setError(conflictAt, { message });
    else setError('root', { message });
    return;
  }

  let placed = false;
  for (const { field, message } of error.details ?? []) {
    const target = fields[field];
    if (target) {
      setError(target, { message });
      placed = true;
    }
  }
  if (!placed) setError('root', { message: error.message });
}
