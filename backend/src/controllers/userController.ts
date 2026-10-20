import type { Request, Response } from 'express';
import * as sessionService from '../services/sessionService';
import * as userService from '../services/userService';
import { sendSuccess } from '../utils/sendSuccess';
import type { IdParams } from '../validators/common';
import type { CreateUserInput } from '../validators/user';

export async function create(req: Request<object, unknown, CreateUserInput>, res: Response) {
  sendSuccess(res, await userService.createUser(req.body), 201, 'User created');
}

export async function list(_req: Request, res: Response) {
  sendSuccess(res, await userService.listUsers());
}

export async function getOne(req: Request<IdParams>, res: Response) {
  sendSuccess(res, await userService.getUser(req.params.id));
}

export async function getSessions(req: Request<IdParams>, res: Response) {
  sendSuccess(res, await sessionService.listUserSessions(req.params.id));
}
