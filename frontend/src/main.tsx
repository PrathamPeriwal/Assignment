import { QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'motion/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { ActingAsProvider } from '@/features/acting-as/ActingAsProvider';
import { queryClient } from '@/lib/query-client';
import { router } from './router';
import './styles/index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

createRoot(root).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <ActingAsProvider>
            <RouterProvider router={router} />
          </ActingAsProvider>
        </ToastProvider>
      </QueryClientProvider>
    </MotionConfig>
  </StrictMode>,
);
