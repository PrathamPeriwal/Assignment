import { addDays, format, isValid, parse, startOfDay } from 'date-fns';

const INPUT_FORMAT = 'yyyy-MM-dd';

export const WEEK_LENGTH = 7;

export function weekFrom(today: Date) {
  return Array.from({ length: WEEK_LENGTH }, (_, index) => addDays(today, index));
}

export const toInputValue = (day: Date) => format(day, INPUT_FORMAT);

export function fromInputValue(value: string) {
  const parsed = parse(value, INPUT_FORMAT, new Date());
  return isValid(parsed) ? startOfDay(parsed) : null;
}

export const formatLongDay = (day: Date) => format(day, 'EEEE d MMMM');
