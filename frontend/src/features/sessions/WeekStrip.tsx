import { format, isSameDay } from 'date-fns';
import { motion } from 'motion/react';
import { cn } from '@/lib/cn';
import { weekFrom } from './days';

interface WeekStripProps {
  today: Date;
  selected: Date;
  onSelect: (day: Date) => void;
}

export function WeekStrip({ today, selected, onSelect }: WeekStripProps) {
  return (
    <ol aria-label="Next seven days" className="rule grid grid-cols-7 rounded-sm bg-paper">
      {weekFrom(today).map((day, index) => {
        const isSelected = isSameDay(day, selected);
        const isToday = index === 0;
        return (
          <li key={day.getTime()} className={cn(index > 0 && 'rule-l')}>
            <button
              type="button"
              aria-pressed={isSelected}
              aria-label={`${format(day, 'EEEE d MMMM')}${isToday ? ', today' : ''}`}
              onClick={() => onSelect(day)}
              className={cn(
                'relative flex w-full flex-col items-center gap-0.5 px-0.5 pt-3 pb-2.5',
                'transition-colors duration-200 hover:bg-paper-2',
                isSelected && 'bg-paper-2',
              )}
            >
              <span className="mono-label text-ink-soft">{format(day, 'EEE')}</span>
              <span className="relative grid h-11 w-11 place-items-center">
                {isSelected && (
                  <motion.span
                    layoutId="week-stamp"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-sm border-2 border-vermilion"
                    style={{ rotate: -5 }}
                    transition={{ type: 'spring', stiffness: 520, damping: 28 }}
                  />
                )}
                <span className="font-display relative text-h3">{format(day, 'd')}</span>
              </span>
              <span className="mono-label h-3 text-ink-soft">{isToday ? 'Today' : ''}</span>
              {isToday && (
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-vermilion" />
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
