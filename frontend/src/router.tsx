import { createBrowserRouter, type RouteObject } from 'react-router';
import { AppShell } from '@/components/layout/AppShell';
import { RouteError } from '@/components/layout/RouteError';
import { HomePage } from '@/features/home/HomePage';
import { MePage } from '@/features/me/MePage';
import { NotFoundPage } from '@/features/not-found/NotFoundPage';
import { SessionsPage } from '@/features/sessions/SessionsPage';
import { TeachersPage } from '@/features/teachers/TeachersPage';

const devRoutes: RouteObject[] = import.meta.env.DEV
  ? [
      {
        path: 'styleguide',
        lazy: async () => ({
          Component: (await import('@/features/styleguide/StyleguidePage')).StyleguidePage,
        }),
      },
    ]
  : [];

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'sessions', element: <SessionsPage /> },
      { path: 'teachers', element: <TeachersPage /> },
      { path: 'me', element: <MePage /> },
      ...devRoutes,
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
