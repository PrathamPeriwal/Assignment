import type { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';
import { formatIssues } from '../utils/formatIssues';
import { logger } from '../utils/logger';

interface DuplicateKeyError {
  code: 11000;
  keyValue?: Record<string, unknown>;
}

function isDuplicateKey(err: unknown): err is DuplicateKeyError {
  return typeof err === 'object' && err !== null && 'code' in err && err.code === 11000;
}

function isBadJson(err: unknown) {
  return (
    typeof err === 'object' && err !== null && 'type' in err && err.type === 'entity.parse.failed'
  );
}

function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;
  if (err instanceof ZodError) {
    return new ApiError(400, 'VALIDATION_ERROR', 'Validation failed', formatIssues(err));
  }
  if (err instanceof mongoose.Error.CastError) {
    return new ApiError(400, 'INVALID_ID', `Invalid value for ${err.path}`);
  }
  if (err instanceof mongoose.Error.ValidationError) {
    return new ApiError(400, 'VALIDATION_ERROR', 'Validation failed', err.errors);
  }
  if (isDuplicateKey(err)) {
    const fields = Object.keys(err.keyValue ?? {}).join(', ');
    return new ApiError(409, 'CONFLICT', fields ? `${fields} already exists` : 'Already exists');
  }
  if (isBadJson(err)) return new ApiError(400, 'BAD_REQUEST', 'Request body is not valid JSON');
  return new ApiError(500, 'INTERNAL_ERROR', 'Something went wrong');
}

export const errorHandler: ErrorRequestHandler = (err: unknown, _req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }
  const apiError = toApiError(err);
  if (apiError.status >= 500) {
    logger.error(err instanceof Error ? (err.stack ?? err.message) : String(err));
  }
  res.status(apiError.status).json({
    success: false,
    error: {
      code: apiError.code,
      message: apiError.message,
      ...(apiError.details !== undefined && { details: apiError.details }),
    },
  });
};
