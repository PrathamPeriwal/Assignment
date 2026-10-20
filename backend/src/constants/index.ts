export const SessionStatus = {
  AVAILABLE: 'AVAILABLE',
  BOOKED: 'BOOKED',
  COMPLETED: 'COMPLETED',
} as const;

export type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus];

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'INVALID_ID'
  | 'BAD_REQUEST'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR';
