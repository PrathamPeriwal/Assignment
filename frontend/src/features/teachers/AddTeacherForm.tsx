import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { FormError } from '@/components/ui/FormError';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/toast-context';
import { applyApiError } from '@/lib/form-errors';
import { useCreateTeacher } from './hooks';
import { teacherSchema, type TeacherValues } from './schemas';

interface AddTeacherFormProps {
  onDone: () => void;
}

export function AddTeacherForm({ onDone }: AddTeacherFormProps) {
  const toast = useToast();
  const createTeacher = useCreateTeacher();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TeacherValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: { fullName: '', email: '', specialization: '' },
  });

  const submit = handleSubmit(async (values) => {
    try {
      const teacher = await createTeacher.mutateAsync(values);
      toast({ title: `Added ${teacher.fullName}`, tone: 'success' });
      onDone();
    } catch (error) {
      applyApiError(error, setError, {
        fields: {
          fullName: 'fullName',
          email: 'email',
          specialization: 'specialization',
          experience: 'experience',
        },
        conflictAt: 'email',
        conflictMessage: 'A teacher with this email already exists.',
      });
    }
  });

  return (
    <form onSubmit={(event) => void submit(event)} noValidate className="flex flex-col gap-4">
      <Field label="Full name" error={errors.fullName?.message}>
        {(control) => <Input autoComplete="off" {...control} {...register('fullName')} />}
      </Field>
      <Field label="Email" error={errors.email?.message}>
        {(control) => <Input type="email" autoComplete="off" {...control} {...register('email')} />}
      </Field>
      <Field label="Specialization" error={errors.specialization?.message}>
        {(control) => <Input autoComplete="off" {...control} {...register('specialization')} />}
      </Field>
      <Field
        label="Years of experience"
        hint="Whole years, 0 to 70."
        error={errors.experience?.message}
      >
        {(control) => (
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            max={70}
            {...control}
            {...register('experience', { valueAsNumber: true })}
          />
        )}
      </Field>
      <FormError>{errors.root?.message}</FormError>
      <div className="flex flex-wrap gap-3 pt-1">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Add teacher'}
        </Button>
        <Button variant="ghost" onClick={onDone} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
