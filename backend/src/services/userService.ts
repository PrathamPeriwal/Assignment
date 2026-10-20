import { User } from '../models';
import { ApiError } from '../utils/ApiError';
import type { CreateUserInput } from '../validators/user';

export async function createUser(input: CreateUserInput) {
  if (await User.exists({ email: input.email })) {
    throw new ApiError(409, 'CONFLICT', 'A user with this email already exists');
  }
  const user = await User.create(input);
  return user.toObject();
}

export function listUsers() {
  return User.find().sort({ createdAt: -1 }).lean();
}

export async function getUser(id: string) {
  const user = await User.findById(id).lean();
  if (!user) throw new ApiError(404, 'NOT_FOUND', 'User not found');
  return user;
}
