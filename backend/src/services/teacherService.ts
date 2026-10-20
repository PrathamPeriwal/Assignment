import { Teacher } from '../models';
import { ApiError } from '../utils/ApiError';
import type { CreateTeacherInput } from '../validators/teacher';

export async function createTeacher(input: CreateTeacherInput) {
  if (await Teacher.exists({ email: input.email })) {
    throw new ApiError(409, 'CONFLICT', 'A teacher with this email already exists');
  }
  const teacher = await Teacher.create(input);
  return teacher.toObject();
}

export function listTeachers() {
  return Teacher.find().sort({ fullName: 1 }).lean();
}
