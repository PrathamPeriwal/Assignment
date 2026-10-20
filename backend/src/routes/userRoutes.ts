import { Router } from 'express';
import * as users from '../controllers/userController';
import { validate } from '../middlewares/validate';
import { idParams } from '../validators/common';
import { createUserBody } from '../validators/user';

export const userRoutes = Router();

userRoutes.post('/', validate({ body: createUserBody }), users.create);
userRoutes.get('/', users.list);
userRoutes.get('/:id', validate({ params: idParams }), users.getOne);
userRoutes.get('/:id/sessions', validate({ params: idParams }), users.getSessions);
