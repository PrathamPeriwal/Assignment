import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { fetchUser, fetchUsers, postUser } from './api';

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: ({ signal }) => fetchUsers(signal),
  });
}

export function useUser(id: string | null) {
  return useQuery({
    queryKey: queryKeys.users.detail(id ?? ''),
    queryFn: ({ signal }) => fetchUser(id ?? '', signal),
    enabled: id !== null,
    retry: false,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.users.list() }),
  });
}
