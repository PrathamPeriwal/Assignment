export type SessionStatus = 'AVAILABLE' | 'BOOKED' | 'COMPLETED';

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Teacher {
  _id: string;
  fullName: string;
  email: string;
  specialization: string;
  experience: number;
  createdAt: string;
  updatedAt: string;
}

export type TeacherSummary = Pick<Teacher, '_id' | 'fullName' | 'specialization' | 'experience'>;

export interface Session {
  _id: string;
  teacherId: string;
  userId: string | null;
  startTime: string;
  endTime: string;
  status: SessionStatus;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AvailableSession {
  _id: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  teacher: TeacherSummary;
}

export interface UserSession extends AvailableSession {
  status: Exclude<SessionStatus, 'AVAILABLE'>;
  completedAt: string | null;
}

export interface UserSessions {
  upcoming: UserSession[];
  completed: UserSession[];
  counts: { upcoming: number; completed: number };
}

export interface CreateUserInput {
  fullName: string;
  email: string;
  phone: string;
}

export interface CreateTeacherInput {
  fullName: string;
  email: string;
  specialization: string;
  experience: number;
}

export interface CreateSessionInput {
  teacherId: string;
  startTime: string;
  endTime: string;
}
