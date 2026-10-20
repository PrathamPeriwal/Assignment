import { format, parseISO } from 'date-fns';

export const formatTime = (iso: string) => format(parseISO(iso), 'HH:mm');

export const formatDay = (iso: string) => format(parseISO(iso), 'EEE d MMM');

export const formatStamp = (iso: string) => format(parseISO(iso), 'd MMM, HH:mm');

export const shortId = (id: string) => id.slice(-4);

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
