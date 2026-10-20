import type { AvailableSession } from '@/lib/types';

export interface SlotGroup {
  startTime: string;
  sessions: AvailableSession[];
  offset: number;
}

export function groupByStart(sessions: AvailableSession[]) {
  const groups: SlotGroup[] = [];
  sessions.forEach((session, index) => {
    const last = groups.at(-1);
    if (last && last.startTime === session.startTime) last.sessions.push(session);
    else groups.push({ startTime: session.startTime, sessions: [session], offset: index });
  });
  return groups;
}

export function matchesQuery(session: AvailableSession, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const { fullName, specialization } = session.teacher;
  return `${fullName} ${specialization}`.toLowerCase().includes(needle);
}
