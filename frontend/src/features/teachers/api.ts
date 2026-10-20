import { request } from '@/lib/api-client';
import type { CreateTeacherInput, Teacher } from '@/lib/types';

export const fetchTeachers = (signal?: AbortSignal) => request<Teacher[]>('/teachers', { signal });

export const postTeacher = (input: CreateTeacherInput) =>
  request<Teacher>('/teachers', { method: 'POST', body: input });
