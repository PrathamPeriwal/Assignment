import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { startOfDay } from 'date-fns';
import { queryKeys } from '@/lib/query-keys';
import {
  fetchAvailableSessions,
  fetchUserSessions,
  patchComplete,
  postBooking,
  postSession,
} from './api';

export function useAvailableSessions(day: Date) {
  const dateTimestamp = startOfDay(day).getTime();
  // JS reports minutes behind UTC, the API wants minutes ahead
  const tzOffsetMinutes = -new Date(dateTimestamp).getTimezoneOffset();
  return useQuery({
    queryKey: queryKeys.sessions.available(dateTimestamp, tzOffsetMinutes),
    queryFn: ({ signal }) => fetchAvailableSessions(dateTimestamp, tzOffsetMinutes, signal),
  });
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
  });
}
