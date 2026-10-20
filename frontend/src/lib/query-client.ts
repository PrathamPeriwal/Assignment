import { QueryClient } from '@tanstack/react-query';
import { isApiError } from './api-error';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: (count, error) =>
        !(isApiError(error) && error.status < 500 && error.status > 0) && count < 2,
    },
  },
});
