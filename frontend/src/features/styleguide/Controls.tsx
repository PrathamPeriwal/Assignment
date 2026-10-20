import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { Stamp } from '@/components/ui/Stamp';
import { useToast } from '@/components/ui/toast-context';
import { useActingAs } from '@/features/acting-as/context';

export function Buttons() {
  return (
    <div className="flex flex-col gap-6">
      {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
        <div key={variant} className="flex flex-wrap items-center gap-5">
          <span className="mono-label w-24 text-ink-soft">{variant}</span>
          <Button variant={variant} size="sm">
            Small
          </Button>
          <Button variant={variant}>Medium</Button>
          <Button variant={variant} size="lg">
            Large
          </Button>
          <Button variant={variant} disabled>
            Disabled
          </Button>
        </div>
      ))}
    </div>
  );
}

export function Fields() {
  return (
    <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
      <Field label="Full name" hint="As you want it on the ticket.">
        {(control) => <Input placeholder="Aarav Shah" {...control} />}
      </Field>
      <Field label="Email" error="Enter a valid email address">
        {(control) => <Input defaultValue="aarav@" {...control} />}
      </Field>
      <Field label="Specialization">
        {(control) => (
          <Select defaultValue="db" {...control}>
            <option value="algo">Algorithms</option>
            <option value="db">Databases</option>
            <option value="os">Operating systems</option>
          </Select>
        )}
      </Field>
      <Field label="Disabled">
        {(control) => <Input disabled defaultValue="Not editable" {...control} />}
      </Field>
    </div>
  );
}

export function Overlays() {
  const [open, setOpen] = useState(false);
  const { openPicker } = useActingAs();

  return (
    <div className="flex flex-wrap gap-4">
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open a dialog
      </Button>
      <Button variant="secondary" onClick={openPicker}>
        Open the user picker
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        label="Sample"
        title="Book this slot?"
        description="Thursday 22 Oct, 14:00 with Priya Raman."
      >
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setOpen(false)}>Book it</Button>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Not now
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

export function Toasts() {
  const toast = useToast();

  return (
    <div className="flex flex-wrap gap-4">
      <Button
        variant="secondary"
        onClick={() => toast({ title: 'Saved', description: 'Nothing else to do here.' })}
      >
        Neutral toast
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ title: 'Session booked', tone: 'success' })}
      >
        Success toast
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            title: 'Someone got there first',
            description: 'That slot was just taken.',
            tone: 'error',
          })
        }
      >
        Error toast
      </Button>
    </div>
  );
}

export function Stamps() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Stamp tone="vermilion">Booked</Stamp>
      <Stamp tone="moss">Done</Stamp>
      <Stamp tone="ink" tilt={4}>
        Void
      </Stamp>
    </div>
  );
}

export function Skeletons() {
  return (
    <div className="flex max-w-sm flex-col gap-3">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
