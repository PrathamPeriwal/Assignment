import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { app } from '../src/app';
import { SessionStatus } from '../src/constants';
import { Session, Teacher, User } from '../src/models';

interface ApiBody {
  success: boolean;
  data?: unknown;
  message?: string;
  error?: { code: string; message: string; details?: unknown };
}

interface AvailableRow {
  _id: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  teacher: {
    _id: string;
    fullName: string;
    specialization: string;
    experience: number;
  };
}

interface UserSessionRow {
  _id: string;
  startTime: string;
  endTime: string;
  status: string;
  completedAt: string | null;
  durationMinutes: number;
  teacher: { fullName: string; specialization: string };
}

interface UserSessions {
  upcoming: UserSessionRow[];
  completed: UserSessionRow[];
  counts: { upcoming: number; completed: number };
}

function readBody(res: request.Response): ApiBody {
  const value: unknown = res.body;
  if (typeof value !== 'object' || value === null || !('success' in value)) {
    throw new Error('response was not the API envelope');
  }
  return value as ApiBody;
}

function expectError(res: request.Response, status: number, code: string) {
  expect(res.status).toBe(status);
  const body = readBody(res);
  expect(body.success).toBe(false);
  expect(body.error?.code).toBe(code);
  return body;
}

async function makeTeacher(email = 'ada@example.com') {
  return Teacher.create({
    fullName: 'Ada Lovelace',
    email,
    specialization: 'Algorithms',
    experience: 12,
  });
}

async function makeUser(email = 'alan@example.com', fullName = 'Alan Turing') {
  return User.create({ fullName, email, phone: '+44 7700 900111' });
}

describe('api', () => {
  let mongo: MongoMemoryServer | undefined;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
    await Promise.all([User.init(), Teacher.init(), Session.init()]);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo?.stop();
  });

  beforeEach(async () => {
    await Promise.all([User.deleteMany({}), Teacher.deleteMany({}), Session.deleteMany({})]);
  });

  describe('POST /users', () => {
    it('creates a user', async () => {
      const res = await request(app).post('/users').send({
        fullName: '  Ada Lovelace  ',
        email: ' Ada@Example.com ',
        phone: '+44 7700 900111',
      });

      expect(res.status).toBe(201);
      const body = readBody(res);
      expect(body.success).toBe(true);
      expect(body.message).toBe('User created');
      expect(body.data).toMatchObject({
        fullName: 'Ada Lovelace',
        email: 'ada@example.com',
        phone: '+44 7700 900111',
      });
      const data = body.data as { _id: string };
      expect(data._id).toMatch(/^[0-9a-f]{24}$/i);
    });

    it('returns 409 when the email already exists', async () => {
      await request(app).post('/users').send({
        fullName: 'Ada Lovelace',
        email: 'ada@example.com',
        phone: '+44 7700 900111',
      });

      const res = await request(app).post('/users').send({
        fullName: 'Another Ada',
        email: 'Ada@Example.com',
        phone: '+1 202 555 0148',
      });

      const body = expectError(res, 409, 'CONFLICT');
      expect(body.error?.message).toBe('A user with this email already exists');
    });

    it('returns 400 for an invalid body', async () => {
      const res = await request(app).post('/users').send({
        fullName: '',
        email: 'not-an-email',
        phone: 'x',
      });

      const body = expectError(res, 400, 'VALIDATION_ERROR');
      expect(body.error?.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'fullName' }),
          expect.objectContaining({ field: 'email' }),
          expect.objectContaining({ field: 'phone' }),
        ]),
      );
    });
  });

  describe('POST /sessions', () => {
    it('creates an available session', async () => {
      const teacher = await makeTeacher();
      const res = await request(app)
        .post('/sessions')
        .send({
          teacherId: String(teacher._id),
          startTime: '2030-04-02T10:00:00.000Z',
          endTime: '2030-04-02T11:00:00.000Z',
        });

      expect(res.status).toBe(201);
      const body = readBody(res);
      expect(body.success).toBe(true);
      expect(body.message).toBe('Session created');
      expect(body.data).toMatchObject({
        teacherId: String(teacher._id),
        userId: null,
        status: SessionStatus.AVAILABLE,
        completedAt: null,
      });
    });

    it('returns 404 when the teacher does not exist', async () => {
      const res = await request(app).post('/sessions').send({
        teacherId: new mongoose.Types.ObjectId().toString(),
        startTime: '2030-04-02T10:00:00.000Z',
        endTime: '2030-04-02T11:00:00.000Z',
      });

      const body = expectError(res, 404, 'NOT_FOUND');
      expect(body.error?.message).toBe('Teacher not found');
    });

    it('returns 400 when endTime is not after startTime', async () => {
      const teacher = await makeTeacher();
      const res = await request(app)
        .post('/sessions')
        .send({
          teacherId: String(teacher._id),
          startTime: '2030-04-02T10:00:00.000Z',
          endTime: '2030-04-02T10:00:00.000Z',
        });

      const body = expectError(res, 400, 'VALIDATION_ERROR');
      expect(body.error?.details).toEqual([
        { field: 'endTime', message: 'endTime must be after startTime' },
      ]);
    });

    it('returns 409 when the teacher already has an overlapping session', async () => {
      const teacher = await makeTeacher();
      const first = await request(app)
        .post('/sessions')
        .send({
          teacherId: String(teacher._id),
          startTime: '2030-04-02T10:00:00.000Z',
          endTime: '2030-04-02T11:00:00.000Z',
        });
      expect(first.status).toBe(201);

      const res = await request(app)
        .post('/sessions')
        .send({
          teacherId: String(teacher._id),
          startTime: '2030-04-02T10:30:00.000Z',
          endTime: '2030-04-02T11:30:00.000Z',
        });

      const body = expectError(res, 409, 'CONFLICT');
      expect(body.error?.message).toBe('Teacher already has a session overlapping this time');
    });
  });

  describe('GET /sessions/available', () => {
    it('returns that day’s available sessions with the teacher', async () => {
      const teacher = await makeTeacher();
      const user = await makeUser();
      const later = await Session.create({
        teacherId: teacher._id,
        startTime: new Date('2030-06-15T11:00:00.000Z'),
        endTime: new Date('2030-06-15T12:30:00.000Z'),
      });
      const morning = await Session.create({
        teacherId: teacher._id,
        startTime: new Date('2030-06-15T09:00:00.000Z'),
        endTime: new Date('2030-06-15T10:00:00.000Z'),
      });
      const booked = await Session.create({
        teacherId: teacher._id,
        userId: user._id,
        startTime: new Date('2030-06-15T14:00:00.000Z'),
        endTime: new Date('2030-06-15T15:00:00.000Z'),
        status: SessionStatus.BOOKED,
      });
      const otherDay = await Session.create({
        teacherId: teacher._id,
        startTime: new Date('2030-06-16T09:00:00.000Z'),
        endTime: new Date('2030-06-16T10:00:00.000Z'),
      });

      const res = await request(app)
        .get('/sessions/available')
        .query({ dateTimestamp: String(Date.parse('2030-06-15T18:00:00.000Z')) });

      expect(res.status).toBe(200);
      const body = readBody(res);
      expect(body.success).toBe(true);
      const rows = body.data as AvailableRow[];
      expect(rows.map((row) => row._id)).toEqual([String(morning._id), String(later._id)]);
      expect(rows.map((row) => row._id)).not.toContain(String(booked._id));
      expect(rows.map((row) => row._id)).not.toContain(String(otherDay._id));
      expect(rows[0]).toMatchObject({
        durationMinutes: 60,
        teacher: {
          _id: String(teacher._id),
          fullName: 'Ada Lovelace',
          specialization: 'Algorithms',
          experience: 12,
        },
      });
      expect(rows[1]?.durationMinutes).toBe(90);
    });

    it('returns 400 for a bad timestamp', async () => {
      const res = await request(app)
        .get('/sessions/available')
        .query({ dateTimestamp: 'tomorrow' });
      expectError(res, 400, 'VALIDATION_ERROR');
    });
  });

  describe('POST /sessions/:id/book', () => {
    it('books an available session', async () => {
      const teacher = await makeTeacher();
      const user = await makeUser();
      const session = await Session.create({
        teacherId: teacher._id,
        startTime: new Date('2030-05-01T10:00:00.000Z'),
        endTime: new Date('2030-05-01T11:00:00.000Z'),
      });

      const res = await request(app)
        .post(`/sessions/${String(session._id)}/book`)
        .send({ userId: String(user._id) });

      expect(res.status).toBe(200);
      const body = readBody(res);
      expect(body.message).toBe('Session booked');
      expect(body.data).toMatchObject({
        status: SessionStatus.BOOKED,
        userId: String(user._id),
      });
    });

    it('returns 404 when the user does not exist', async () => {
      const teacher = await makeTeacher();
      const session = await Session.create({
        teacherId: teacher._id,
        startTime: new Date('2030-05-01T10:00:00.000Z'),
        endTime: new Date('2030-05-01T11:00:00.000Z'),
      });

      const res = await request(app)
        .post(`/sessions/${String(session._id)}/book`)
        .send({ userId: new mongoose.Types.ObjectId().toString() });

      const body = expectError(res, 404, 'NOT_FOUND');
      expect(body.error?.message).toBe('User not found');
    });

    it('returns 404 when the session does not exist', async () => {
      const user = await makeUser();
      const res = await request(app)
        .post(`/sessions/${new mongoose.Types.ObjectId().toString()}/book`)
        .send({ userId: String(user._id) });

      const body = expectError(res, 404, 'NOT_FOUND');
      expect(body.error?.message).toBe('Session not found');
    });

    it('returns 409 when the session is already booked', async () => {
      const teacher = await makeTeacher();
      const user = await makeUser();
      const other = await makeUser('grace@example.com', 'Grace Hopper');
      const session = await Session.create({
        teacherId: teacher._id,
        startTime: new Date('2030-05-01T10:00:00.000Z'),
        endTime: new Date('2030-05-01T11:00:00.000Z'),
      });

      const first = await request(app)
        .post(`/sessions/${String(session._id)}/book`)
        .send({ userId: String(user._id) });
      expect(first.status).toBe(200);

      const res = await request(app)
        .post(`/sessions/${String(session._id)}/book`)
        .send({ userId: String(other._id) });

      const body = expectError(res, 409, 'CONFLICT');
      expect(body.error?.message).toBe('Session cannot be booked, current status is BOOKED');
    });

    it('lets exactly one of five parallel bookings succeed', async () => {
      const teacher = await makeTeacher();
      const users = await Promise.all(
        [0, 1, 2, 3, 4].map((n) =>
          User.create({
            fullName: `Student ${n}`,
            email: `student${n}@example.com`,
            phone: '+1 202 555 0148',
          }),
        ),
      );
      const session = await Session.create({
        teacherId: teacher._id,
        startTime: new Date('2030-05-02T10:00:00.000Z'),
        endTime: new Date('2030-05-02T11:00:00.000Z'),
      });

      const results = await Promise.all(
        users.map((user) =>
          request(app)
            .post(`/sessions/${String(session._id)}/book`)
            .send({ userId: String(user._id) }),
        ),
      );

      const won = results.filter((res) => res.status === 200);
      const lost = results.filter((res) => res.status === 409);
      expect(won).toHaveLength(1);
      expect(lost).toHaveLength(4);
      for (const res of lost) expect(readBody(res).error?.code).toBe('CONFLICT');

      const winner = won[0];
      expect(winner).toBeDefined();
      if (!winner) return;
      const booked = readBody(winner).data as { userId: string; status: string };
      expect(booked.status).toBe(SessionStatus.BOOKED);

      const saved = await Session.findById(session._id).lean();
      expect(saved?.status).toBe(SessionStatus.BOOKED);
      expect(String(saved?.userId)).toBe(booked.userId);
    });
  });

  describe('PATCH /sessions/:id/complete', () => {
    it('sets completedAt when a booked session is completed', async () => {
      const teacher = await makeTeacher();
      const user = await makeUser();
      const session = await Session.create({
        teacherId: teacher._id,
        userId: user._id,
        startTime: new Date('2030-05-01T10:00:00.000Z'),
        endTime: new Date('2030-05-01T11:00:00.000Z'),
        status: SessionStatus.BOOKED,
      });

      const before = Date.now();
      const res = await request(app).patch(`/sessions/${String(session._id)}/complete`);
      const after = Date.now();

      expect(res.status).toBe(200);
      const body = readBody(res);
      expect(body.message).toBe('Session completed');
      const data = body.data as { status: string; completedAt: string };
      expect(data.status).toBe(SessionStatus.COMPLETED);
      const completedAt = new Date(data.completedAt).getTime();
      expect(completedAt).toBeGreaterThanOrEqual(before);
      expect(completedAt).toBeLessThanOrEqual(after);
    });

    it('returns 409 when the session is still available', async () => {
      const teacher = await makeTeacher();
      const session = await Session.create({
        teacherId: teacher._id,
        startTime: new Date('2030-05-01T10:00:00.000Z'),
        endTime: new Date('2030-05-01T11:00:00.000Z'),
      });

      const res = await request(app).patch(`/sessions/${String(session._id)}/complete`);
      const body = expectError(res, 409, 'CONFLICT');
      expect(body.error?.message).toBe('Session cannot be completed, current status is AVAILABLE');
    });

    it('returns 409 when the session is completed twice', async () => {
      const teacher = await makeTeacher();
      const user = await makeUser();
      const session = await Session.create({
        teacherId: teacher._id,
        userId: user._id,
        startTime: new Date('2030-05-01T10:00:00.000Z'),
        endTime: new Date('2030-05-01T11:00:00.000Z'),
        status: SessionStatus.BOOKED,
      });

      const first = await request(app).patch(`/sessions/${String(session._id)}/complete`);
      expect(first.status).toBe(200);

      const res = await request(app).patch(`/sessions/${String(session._id)}/complete`);
      const body = expectError(res, 409, 'CONFLICT');
      expect(body.error?.message).toBe('Session cannot be completed, current status is COMPLETED');
    });
  });

  describe('GET /users/:id/sessions', () => {
    it('splits booked and completed sessions and reports counts', async () => {
      const teacher = await makeTeacher();
      const user = await makeUser();
      const someoneElse = await makeUser('grace@example.com', 'Grace Hopper');

      const late = await Session.create({
        teacherId: teacher._id,
        userId: user._id,
        startTime: new Date('2030-07-02T15:00:00.000Z'),
        endTime: new Date('2030-07-02T16:00:00.000Z'),
        status: SessionStatus.BOOKED,
      });
      const early = await Session.create({
        teacherId: teacher._id,
        userId: user._id,
        startTime: new Date('2030-07-01T09:00:00.000Z'),
        endTime: new Date('2030-07-01T10:00:00.000Z'),
        status: SessionStatus.BOOKED,
      });
      const older = await Session.create({
        teacherId: teacher._id,
        userId: user._id,
        startTime: new Date('2030-06-01T09:00:00.000Z'),
        endTime: new Date('2030-06-01T10:00:00.000Z'),
        status: SessionStatus.COMPLETED,
        completedAt: new Date('2030-06-01T10:00:00.000Z'),
      });
      const newer = await Session.create({
        teacherId: teacher._id,
        userId: user._id,
        startTime: new Date('2030-06-08T09:00:00.000Z'),
        endTime: new Date('2030-06-08T10:00:00.000Z'),
        status: SessionStatus.COMPLETED,
        completedAt: new Date('2030-06-08T11:00:00.000Z'),
      });
      await Session.create({
        teacherId: teacher._id,
        userId: someoneElse._id,
        startTime: new Date('2030-07-03T09:00:00.000Z'),
        endTime: new Date('2030-07-03T10:00:00.000Z'),
        status: SessionStatus.BOOKED,
      });
      await Session.create({
        teacherId: teacher._id,
        startTime: new Date('2030-07-04T09:00:00.000Z'),
        endTime: new Date('2030-07-04T10:00:00.000Z'),
      });

      const res = await request(app).get(`/users/${String(user._id)}/sessions`);
      expect(res.status).toBe(200);
      const data = readBody(res).data as UserSessions;

      expect(data.counts).toEqual({ upcoming: 2, completed: 2 });
      expect(data.upcoming.map((row) => row._id)).toEqual([String(early._id), String(late._id)]);
      expect(data.completed.map((row) => row._id)).toEqual([String(newer._id), String(older._id)]);
      expect(data.upcoming.every((row) => row.status === SessionStatus.BOOKED)).toBe(true);
      expect(data.completed.every((row) => row.status === SessionStatus.COMPLETED)).toBe(true);
      expect(data.upcoming[0]?.teacher).toMatchObject({
        fullName: 'Ada Lovelace',
        specialization: 'Algorithms',
      });
      expect(data.upcoming[0]?.durationMinutes).toBe(60);
    });

    it('returns 404 when the user does not exist', async () => {
      const res = await request(app).get(
        `/users/${new mongoose.Types.ObjectId().toString()}/sessions`,
      );
      const body = expectError(res, 404, 'NOT_FOUND');
      expect(body.error?.message).toBe('User not found');
    });
  });
});
