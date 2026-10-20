import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { ApiError } from '../utils/ApiError';
import { formatIssues } from '../utils/formatIssues';

interface Schemas {
  params?: ZodType;
  query?: ZodType;
  body?: ZodType;
}

export function validate(schemas: Schemas): RequestHandler {
  return (req, _res, next) => {
    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        throw new ApiError(400, 'INVALID_ID', 'Invalid id in path', formatIssues(result.error));
      }
    }
    if (schemas.query) {
      // Express 5 exposes req.query as a getter, so the parsed copy has to be defined over it.
      Object.defineProperty(req, 'query', {
        value: schemas.query.parse(req.query),
        writable: true,
      });
    }
    if (schemas.body) {
      req.body = schemas.body.parse(req.body);
    }
    next();
  };
}
