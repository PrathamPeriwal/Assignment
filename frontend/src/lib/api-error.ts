export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'INVALID_ID'
  | 'BAD_REQUEST'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR'
  | 'NETWORK_ERROR'
  | 'BAD_RESPONSE';

export interface FieldIssue {
  field: string;
  message: string;
}

export class ApiError extends Error {
  code: ApiErrorCode;
  status: number;
  details: FieldIssue[] | undefined;

  constructor(status: number, code: ApiErrorCode, message: string, details?: FieldIssue[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError;
}

export function isConflict(value: unknown): value is ApiError {
  return isApiError(value) && value.status === 409;
}
