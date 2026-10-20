import type { Request, Response } from 'express';
import * as sessionService from '../services/sessionService';
import { sendSuccess } from '../utils/sendSuccess';
import type { IdParams } from '../validators/common';
import type { AvailableQuery, BookInput, CreateSessionInput } from '../validators/session';

export async function create(req: Request<object, unknown, CreateSessionInput>, res: Response) {
  sendSuccess(res, await sessionService.createSession(req.body), 201, 'Session created');
}

export async function listAvailable(req: Request, res: Response) {
  // validate() has already replaced req.query with the parsed values.
  const query = req.query as unknown as AvailableQuery;
  sendSuccess(res, await sessionService.listAvailable(query));
}

export async function book(req: Request<IdParams, unknown, BookInput>, res: Response) {
  const session = await sessionService.bookSession(req.params.id, req.body.userId);
  sendSuccess(res, session, 200, 'Session booked');
}

export async function complete(req: Request<IdParams>, res: Response) {
  sendSuccess(res, await sessionService.completeSession(req.params.id), 200, 'Session completed');
}
