import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { FormError } from '@/components/ui/FormError';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/toast-context';
import { useCreateSession } from '@/features/sessions/hooks';
import { applyApiError } from '@/lib/form-errors';
import { formatDay, formatTime } from '@/lib/format';
import type { Teacher } from '@/lib/types';
import { sessionSchema, toIso, todayInput, type SessionValues } from './schemas';

interface CreateSessionFormProps {
  teacher: Teacher;
  onDone: () => void;
}

export function CreateSessionForm({ teacher, onDone }: CreateSessionFormProps) {
  const toast = useToast();
  const createSession = useCreateSession();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SessionValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues: { date: todayInput(), start: '', end: '' },
  });

  const submit = handleSubmit(async (values) => {
    const startTime = toIso(values.date, values.start);
    const endTime = toIso(values.date, values.end);
    try {
      await createSession.mutateAsync({ teacherId: teacher._id, startTime, endTime });
      toast({
        title: 'Session created',
        description: `${teacher.fullName}, ${formatDay(startTime)}, ${formatTime(startTime)} to ${formatTime(endTime)}`,
        tone: 'success',
      });
      onDone();
    } catch (error) {
      applyApiError(error, setError, {
        fields: { startTime: 'start', endTime: 'end' },
        conflictMessage: `${teacher.fullName} already has a session that overlaps this time. Pick a different slot.`,
      });
    }
  });

  return (
    <form onSubmit={(event) => void submit(event)} noValidate className="flex flex-col gap-4">
      <Field label="Date" error={errors.date?.message}>
        {(control) => <Input type="date" {...control} {...register('date')} />}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Start time" error={errors.start?.message}>
          {(control) => <Input type="time" {...control} {...register('start')} />}
        </Field>
        <Field label="End time" error={errors.end?.message}>
          {(control) => <Input type="time" {...control} {...register('end')} />}
        </Field>
      </div>
      <p className="text-sm text-ink-soft">Times are in your local timezone.</p>
      <FormError>{errors.root?.message}</FormError>
      <div className="flex flex-wrap gap-3 pt-1">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Create session'}
        </Button>
        <Button variant="ghost" onClick={onDone} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
