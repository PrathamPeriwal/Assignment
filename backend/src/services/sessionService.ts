import { Types, type PipelineStage } from 'mongoose';
import { SessionStatus } from '../constants';
import { Session, Teacher, User } from '../models';
import { ApiError } from '../utils/ApiError';
import { dayRange } from '../utils/date';
import type { AvailableQuery, CreateSessionInput } from '../validators/session';

const durationMinutes = {
  $dateDiff: { startDate: '$startTime', endDate: '$endTime', unit: 'minute' },
};

const teacherFields = {
  _id: '$teacher._id',
  fullName: '$teacher.fullName',
  specialization: '$teacher.specialization',
  experience: '$teacher.experience',
};

const joinTeacher: PipelineStage[] = [
  { $lookup: { from: 'teachers', localField: 'teacherId', foreignField: '_id', as: 'teacher' } },
  { $unwind: '$teacher' },
];

export async function createSession(input: CreateSessionInput) {
  if (!(await Teacher.exists({ _id: input.teacherId }))) {
    throw new ApiError(404, 'NOT_FOUND', 'Teacher not found');
  }
  const overlap = await Session.exists({
    teacherId: input.teacherId,
    startTime: { $lt: input.endTime },
    endTime: { $gt: input.startTime },
  });
  if (overlap) {
    throw new ApiError(409, 'CONFLICT', 'Teacher already has a session overlapping this time');
  }
  const session = await Session.create(input);
  return session.toObject();
}

export function listAvailable({ dateTimestamp, tzOffsetMinutes }: AvailableQuery) {
  const { start, end } = dayRange(dateTimestamp, tzOffsetMinutes);
  return Session.aggregate([
    { $match: { status: SessionStatus.AVAILABLE, startTime: { $gte: start, $lt: end } } },
    { $sort: { startTime: 1 } },
    ...joinTeacher,
    {
      $project: {
        startTime: 1,
        endTime: 1,
        durationMinutes,
        teacher: teacherFields,
      },
    },
  ]);
}

export async function bookSession(sessionId: string, userId: string) {
  if (!(await User.exists({ _id: userId }))) {
    throw new ApiError(404, 'NOT_FOUND', 'User not found');
  }
  const booked = await Session.findOneAndUpdate(
    { _id: sessionId, status: SessionStatus.AVAILABLE },
    { $set: { status: SessionStatus.BOOKED, userId } },
    { new: true },
  ).lean();
  if (booked) return booked;
  throw await whyNotUpdated(sessionId, 'booked');
}

export async function completeSession(sessionId: string) {
  const completed = await Session.findOneAndUpdate(
    { _id: sessionId, status: SessionStatus.BOOKED },
    { $set: { status: SessionStatus.COMPLETED, completedAt: new Date() } },
    { new: true },
  ).lean();
  if (completed) return completed;
  throw await whyNotUpdated(sessionId, 'completed');
}

export async function listUserSessions(userId: string) {
  if (!(await User.exists({ _id: userId }))) {
    throw new ApiError(404, 'NOT_FOUND', 'User not found');
  }
  const [result] = await Session.aggregate<{ upcoming: unknown[]; completed: unknown[] }>([
    { $match: { userId: new Types.ObjectId(userId) } },
    ...joinTeacher,
    {
      $project: {
        startTime: 1,
        endTime: 1,
        status: 1,
        completedAt: 1,
        durationMinutes,
        teacher: teacherFields,
      },
    },
    {
      $facet: {
        upcoming: [{ $match: { status: SessionStatus.BOOKED } }, { $sort: { startTime: 1 } }],
        completed: [
          { $match: { status: SessionStatus.COMPLETED } },
          { $sort: { completedAt: -1 } },
        ],
      },
    },
  ]);
  const upcoming = result?.upcoming ?? [];
  const completed = result?.completed ?? [];
  return {
    upcoming,
    completed,
    counts: { upcoming: upcoming.length, completed: completed.length },
  };
}

// Runs only after the atomic update matched nothing, to tell a missing session from a wrong status.
async function whyNotUpdated(sessionId: string, action: 'booked' | 'completed') {
  const session = await Session.findById(sessionId).select('status').lean();
  if (!session) return new ApiError(404, 'NOT_FOUND', 'Session not found');
  return new ApiError(
    409,
    'CONFLICT',
    `Session cannot be ${action}, current status is ${session.status}`,
  );
}
