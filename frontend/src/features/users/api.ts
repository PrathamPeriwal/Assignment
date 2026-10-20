import { request } from '@/lib/api-client';
import type { CreateUserInput, User } from '@/lib/types';

export const fetchUsers = (signal?: AbortSignal) => request<User[]>('/users', { signal });

export const fetchUser = (id: string, signal?: AbortSignal) =>
  request<User>(`/users/${id}`, { signal });

export const postUser = (input: CreateUserInput) =>
  request<User>('/users', { method: 'POST', body: input });
