import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/toast-context';
import { useCreateUser } from '@/features/users/hooks';
import { isApiError, isConflict } from '@/lib/api-error';
import { useActingAs } from './context';

const schema = z.object({
  fullName: z.string().trim().min(1, 'Enter a name').max(100, 'Keep it under 100 characters'),
  email: z.string().trim().pipe(z.email('Enter a valid email address')),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ()-]{7,20}$/, 'Use 7 to 20 digits, spaces or dashes'),
});

type FormValues = z.infer<typeof schema>;

interface CreateUserFormProps {
  onDone: () => void;
  onBack: () => void;
}

export function CreateUserForm({ onDone, onBack }: CreateUserFormProps) {
  const { chooseUser } = useActingAs();
  const toast = useToast();
  const createUser = useCreateUser();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: '', email: '', phone: '' },
  });

  const submit = handleSubmit(async (values) => {
    try {
      const user = await createUser.mutateAsync(values);
      chooseUser(user);
      toast({
        title: `Added ${user.fullName}`,
        description: 'You are now acting as them.',
        tone: 'success',
      });
      onDone();
    } catch (error) {
      if (isConflict(error)) {
        setError('email', {
          message: 'Someone already uses this email. Pick them from the list instead.',
        });
      } else if (isApiError(error) && error.details?.length) {
        for (const { field, message } of error.details) {
          if (field in values) setError(field as keyof FormValues, { message });
        }
      } else {
        setError('root', {
          message: isApiError(error) ? error.message : 'Could not save. Try again.',
        });
      }
    }
  });

  return (
    <form onSubmit={(event) => void submit(event)} noValidate className="flex flex-col gap-4">
      <Field label="Full name" error={errors.fullName?.message}>
        {(control) => <Input autoComplete="name" {...control} {...register('fullName')} />}
      </Field>
      <Field label="Email" error={errors.email?.message}>
        {(control) => (
          <Input type="email" autoComplete="email" {...control} {...register('email')} />
        )}
      </Field>
      <Field
        label="Phone"
        hint="Digits, spaces, dashes and a leading + are fine."
        error={errors.phone?.message}
      >
        {(control) => <Input type="tel" autoComplete="tel" {...control} {...register('phone')} />}
      </Field>
      {errors.root && (
        <p role="alert" className="border-l-[3px] border-vermilion pl-2 text-sm">
          {errors.root.message}
        </p>
      )}
      <div className="flex flex-wrap gap-3 pt-1">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save and continue'}
        </Button>
        <Button variant="ghost" onClick={onBack} disabled={isSubmitting}>
          Back to the list
        </Button>
      </div>
    </form>
  );
}
