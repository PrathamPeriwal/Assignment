import { rateLimit } from 'express-rate-limit';
import { ApiError } from '../utils/ApiError';

export const rateLimiter = rateLimit({
  windowMs: 60_000,
  limit: 120,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new ApiError(429, 'RATE_LIMITED', 'Too many requests, slow down'));
  },
});
