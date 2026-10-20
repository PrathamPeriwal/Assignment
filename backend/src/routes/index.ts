import { Router } from 'express';
import { sendSuccess } from '../utils/sendSuccess';
import { sessionRoutes } from './sessionRoutes';
import { teacherRoutes } from './teacherRoutes';
import { userRoutes } from './userRoutes';

export const routes = Router();

routes.get('/health', (_req, res) => {
  sendSuccess(res, { status: 'ok' });
});
routes.use('/users', userRoutes);
routes.use('/teachers', teacherRoutes);
routes.use('/sessions', sessionRoutes);
