import mongoose from 'mongoose';
import { env } from './env';
import { Session, Teacher, User } from '../models';

export async function connectDb() {
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  // Build indexes up front so the unique email constraints hold from the first request.
  await Promise.all([User.init(), Teacher.init(), Session.init()]);
}

export async function disconnectDb() {
  await mongoose.disconnect();
}
