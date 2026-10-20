import { Router } from 'express';
import * as teachers from '../controllers/teacherController';
import { validate } from '../middlewares/validate';
import { createTeacherBody } from '../validators/teacher';

export const teacherRoutes = Router();

teacherRoutes.post('/', validate({ body: createTeacherBody }), teachers.create);
teacherRoutes.get('/', teachers.list);
