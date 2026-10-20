import type { AvailableSession, UserSession } from '@/lib/types';

const teacher = {
  _id: '665f1c2b9a4e4d0012ab3401',
  fullName: 'Ananya Iyer',
  specialization: 'Algorithms',
  experience: 14,
};

export const availableTicket: AvailableSession = {
  _id: '665f1c2b9a4e4d0012ab3501',
  startTime: '2026-10-21T09:00:00.000Z',
  endTime: '2026-10-21T10:00:00.000Z',
  durationMinutes: 60,
  teacher,
};

export const bookedTicket: UserSession = {
  ...availableTicket,
  _id: '665f1c2b9a4e4d0012ab3502',
  startTime: '2026-10-22T14:00:00.000Z',
  endTime: '2026-10-22T14:45:00.000Z',
  durationMinutes: 45,
  status: 'BOOKED',
  completedAt: null,
  teacher: {
    ...teacher,
    _id: '665f1c2b9a4e4d0012ab3402',
    fullName: 'Priya Raman',
    specialization: 'Databases',
    experience: 18,
  },
};

export const completedTicket: UserSession = {
  ...availableTicket,
  _id: '665f1c2b9a4e4d0012ab3503',
  startTime: '2026-10-20T09:00:00.000Z',
  endTime: '2026-10-20T10:00:00.000Z',
  status: 'COMPLETED',
  completedAt: '2026-10-20T10:05:00.000Z',
  teacher: {
    ...teacher,
    _id: '665f1c2b9a4e4d0012ab3403',
    fullName: 'Marcus Delgado',
    specialization: 'Operating systems',
    experience: 9,
  },
};
