import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { fetchTeachers, postTeacher } from './api';

export function useTeachers() {
  return useQuery({
    queryKey: queryKeys.teachers.list(),
    queryFn: ({ signal }) => fetchTeachers(signal),
  });
}

export function useCreateTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postTeacher,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.teachers.all }),
  });
}
