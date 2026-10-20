import {
  queryOptions,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { addDays, startOfDay } from 'date-fns';
import { isConflict } from '@/lib/api-error';
import { queryKeys } from '@/lib/query-keys';
import {
  fetchAvailableSessions,
  fetchUserSessions,
  patchComplete,
  postBooking,
  postSession,
} from './api';
import { WEEK_LENGTH } from './days';

function availableOptions(day: Date) {
  const dateTimestamp = startOfDay(day).getTime();
  // JS reports minutes behind UTC, the API wants minutes ahead
  const tzOffsetMinutes = -new Date(dateTimestamp).getTimezoneOffset();
  return queryOptions({
    queryKey: queryKeys.sessions.available(dateTimestamp, tzOffsetMinutes),
    queryFn: ({ signal }) => fetchAvailableSessions(dateTimestamp, tzOffsetMinutes, signal),
  });
}

export function useAvailableSessions(day: Date) {
  return useQuery(availableOptions(day));
}

export function useNextDayWithSessions(from: Date, enabled: boolean) {
  const days = Array.from({ length: WEEK_LENGTH }, (_, index) => addDays(from, index + 1));
  const results = useQueries({
    queries: days.map((day) => ({ ...availableOptions(day), enabled })),
  });

  const foundAt = results.findIndex((result) => (result.data?.length ?? 0) > 0);
  const day = foundAt === -1 ? undefined : days[foundAt];
  const pending = day === undefined && enabled && results.some((result) => result.isPending);
  return { day, pending };
}

export function useUserSessions(userId: string | null) {
  return useQuery({
    queryKey: queryKeys.users.sessions(userId ?? ''),
    queryFn: ({ signal }) => fetchUserSessions(userId ?? '', signal),
    enabled: userId !== null,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postSession,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all }),
  });
}

export function useBookSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, userId }: { sessionId: string; userId: string }) =>
      postBooking(sessionId, userId),
    onSuccess: (_session, { userId }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.users.sessions(userId) }),
      ]),
    onError: (error) =>
      isConflict(error)
        ? queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all })
        : undefined,
  });
}

export function useCompleteSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchComplete,
    onSuccess: (session) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all }),
        session.userId
          ? queryClient.invalidateQueries({ queryKey: queryKeys.users.sessions(session.userId) })
          : undefined,
      ]),
    onError: (error) =>
      isConflict(error)
        ? queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
        : undefined,
  });
}
