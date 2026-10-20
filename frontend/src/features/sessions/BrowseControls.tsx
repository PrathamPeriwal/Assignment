import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { fromInputValue, toInputValue } from './days';

interface BrowseControlsProps {
  today: Date;
  selected: Date;
  onSelectDay: (day: Date) => void;
  query: string;
  onQueryChange: (query: string) => void;
}

export function BrowseControls({
  today,
  selected,
  onSelectDay,
  query,
  onQueryChange,
}: BrowseControlsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
      <Field label="Filter by teacher or subject">
        {(control) => (
          <Input
            type="search"
            autoComplete="off"
            placeholder="Priya, databases..."
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            {...control}
          />
        )}
      </Field>
      <Field label="Jump to date">
        {(control) => (
          <Input
            type="date"
            min={toInputValue(today)}
            value={toInputValue(selected)}
            onChange={(event) => {
              const day = fromInputValue(event.target.value);
              if (day) onSelectDay(day);
            }}
            {...control}
          />
        )}
      </Field>
    </div>
  );
}
