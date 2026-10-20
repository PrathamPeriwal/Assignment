import type { RequestHandler } from 'express';
import { ApiError } from '../utils/ApiError';

export const notFound: RequestHandler = (req) => {
  throw new ApiError(404, 'NOT_FOUND', `Route ${req.method} ${req.path} not found`);
};
