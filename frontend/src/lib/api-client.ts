import { ApiError, type ApiErrorCode, type FieldIssue } from './api-error';
import { env } from './env';

type Query = Record<string, string | number | undefined>;

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH';
  body?: unknown;
  query?: Query;
  signal?: AbortSignal;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isFieldIssues(value: unknown): value is FieldIssue[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) && typeof item.field === 'string' && typeof item.message === 'string',
    )
  );
}

function buildUrl(path: string, query?: Query) {
  const url = new URL(env.apiUrl + path);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }
  return url;
}

function toApiError(status: number, payload: unknown) {
  const error = isRecord(payload) && isRecord(payload.error) ? payload.error : undefined;
  if (!error) return new ApiError(status, 'BAD_RESPONSE', 'The server sent something unexpected.');
  return new ApiError(
    status,
    typeof error.code === 'string' ? (error.code as ApiErrorCode) : 'INTERNAL_ERROR',
    typeof error.message === 'string' ? error.message : 'Something went wrong.',
    isFieldIssues(error.details) ? error.details : undefined,
  );
}

async function send(url: URL, { method = 'GET', body, signal }: RequestOptions) {
  try {
    return await fetch(url, {
      method,
      signal,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError(
      0,
      'NETWORK_ERROR',
      'Cannot reach the server. Check that the API is running.',
    );
  }
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await send(buildUrl(path, options.query), options);
  const payload: unknown = await response.json().catch(() => undefined);

  if (!response.ok || !isRecord(payload) || payload.success !== true) {
    throw toApiError(response.status, payload);
  }
  return payload.data as T;
}
