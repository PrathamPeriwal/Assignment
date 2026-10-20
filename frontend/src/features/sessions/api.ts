import { request } from '@/lib/api-client';
import type { AvailableSession, CreateSessionInput, Session, UserSessions } from '@/lib/types';

export const fetchAvailableSessions = (
  dateTimestamp: number,
  tzOffsetMinutes: number,
  signal?: AbortSignal,
) =>
  request<AvailableSession[]>('/sessions/available', {
    query: { dateTimestamp, tzOffsetMinutes },
    signal,
  });

export const fetchUserSessions = (userId: string, signal?: AbortSignal) =>
  request<UserSessions>(`/users/${userId}/sessions`, { signal });

export const postSession = (input: CreateSessionInput) =>
  request<Session>('/sessions', { method: 'POST', body: input });

export const postBooking = (sessionId: string, userId: string) =>
  request<Session>(`/sessions/${sessionId}/book`, { method: 'POST', body: { userId } });

export const patchComplete = (sessionId: string) =>
  request<Session>(`/sessions/${sessionId}/complete`, { method: 'PATCH' });
