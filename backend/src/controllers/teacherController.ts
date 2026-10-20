import type { Request, Response } from 'express';
import * as teacherService from '../services/teacherService';
import { sendSuccess } from '../utils/sendSuccess';
import type { CreateTeacherInput } from '../validators/teacher';

export async function create(req: Request<object, unknown, CreateTeacherInput>, res: Response) {
  sendSuccess(res, await teacherService.createTeacher(req.body), 201, 'Teacher created');
}

export async function list(_req: Request, res: Response) {
  sendSuccess(res, await teacherService.listTeachers());
}
