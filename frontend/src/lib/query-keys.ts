const teachers = ['teachers'] as const;
const users = ['users'] as const;
const sessions = ['sessions'] as const;

export const queryKeys = {
  teachers: {
    all: teachers,
    list: () => [...teachers, 'list'] as const,
  },
  users: {
    all: users,
    list: () => [...users, 'list'] as const,
    detail: (id: string) => [...users, 'detail', id] as const,
    sessions: (id: string) => [...users, 'sessions', id] as const,
  },
  sessions: {
    all: sessions,
    available: (dateTimestamp: number, tzOffsetMinutes: number) =>
      [...sessions, 'available', dateTimestamp, tzOffsetMinutes] as const,
  },
};
