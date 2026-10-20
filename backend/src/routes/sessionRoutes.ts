import { Router } from 'express';
import * as sessions from '../controllers/sessionController';
import { validate } from '../middlewares/validate';
import { idParams } from '../validators/common';
import { availableQuery, bookBody, createSessionBody } from '../validators/session';

export const sessionRoutes = Router();

sessionRoutes.post('/', validate({ body: createSessionBody }), sessions.create);
// Must stay above the /:id routes.
sessionRoutes.get('/available', validate({ query: availableQuery }), sessions.listAvailable);
sessionRoutes.post('/:id/book', validate({ params: idParams, body: bookBody }), sessions.book);
sessionRoutes.patch('/:id/complete', validate({ params: idParams }), sessions.complete);
