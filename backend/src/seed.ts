import { connectDb, disconnectDb } from './config/db';
import { SessionStatus } from './constants';
import { Session, Teacher, User } from './models';
import { logger } from './utils/logger';

const teachers = [
  {
    fullName: 'Ananya Iyer',
    email: 'ananya.iyer@example.com',
    specialization: 'Algorithms',
    experience: 14,
  },
  {
    fullName: 'Marcus Hale',
    email: 'marcus.hale@example.com',
    specialization: 'Distributed Systems',
    experience: 9,
  },
  {
    fullName: 'Priya Raman',
    email: 'priya.raman@example.com',
    specialization: 'Databases',
    experience: 18,
  },
  {
    fullName: 'Elena Petrov',
    email: 'elena.petrov@example.com',
    specialization: 'Machine Learning',
    experience: 6,
  },
  {
    fullName: 'James Okonkwo',
    email: 'james.okonkwo@example.com',
    specialization: 'Operating Systems',
    experience: 22,
  },
  {
    fullName: 'Sofia Alvarez',
    email: 'sofia.alvarez@example.com',
    specialization: 'Web Security',
    experience: 11,
  },
];

const users = [
  { fullName: 'Aarav Shah', email: 'aarav.shah@example.com', phone: '+91 98450 11220' },
  { fullName: 'Lila Nguyen', email: 'lila.nguyen@example.com', phone: '+1 415 555 0148' },
  { fullName: 'Noah Williams', email: 'noah.williams@example.com', phone: '+44 7700 900123' },
  { fullName: 'Fatima Khan', email: 'fatima.khan@example.com', phone: '+971 50 123 4567' },
];

// UTC hours, so a default available-day query (offset 0) includes today's open slots.
const daytimeHours = [9, 11, 14, 16];
const completedSlots = new Set([0, 7]);
const bookedSlots = new Set([2, 10, 18, 25]);

function at<T>(items: readonly T[], index: number): T {
  const item = items[index];
  if (item === undefined) throw new Error(`seed index ${index} is out of range`);
  return item;
}

function utcOnDay(dayOffset: number, hour: number) {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + dayOffset, hour),
  );
}

function buildSlots() {
  const slots: { day: number; hour: number; teacherIndex: number }[] = [];
  for (let day = 0; day < 7; day += 1) {
    daytimeHours.forEach((hour, slot) => {
      slots.push({ day, hour, teacherIndex: (day + slot) % teachers.length });
    });
  }
  slots.push({ day: 0, hour: 18, teacherIndex: 4 });
  slots.push({ day: 3, hour: 18, teacherIndex: 1 });
  return slots;
}

async function seed() {
  await Promise.all([User.deleteMany({}), Teacher.deleteMany({}), Session.deleteMany({})]);

  const teacherDocs = await Teacher.insertMany(teachers);
  const userDocs = await User.insertMany(users);
  const slots = buildSlots();

  const sessions = await Session.insertMany(
    slots.map((slot, index) => {
      const startTime = utcOnDay(slot.day, slot.hour);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
      const status = completedSlots.has(index)
        ? SessionStatus.COMPLETED
        : bookedSlots.has(index)
          ? SessionStatus.BOOKED
          : SessionStatus.AVAILABLE;
      const user =
        status === SessionStatus.AVAILABLE ? null : at(userDocs, index % userDocs.length);
      return {
        teacherId: at(teacherDocs, slot.teacherIndex)._id,
        userId: user?._id ?? null,
        startTime,
        endTime,
        status,
        completedAt: status === SessionStatus.COMPLETED ? endTime : null,
      };
    }),
  );

  return { teachers: teacherDocs.length, users: userDocs.length, sessions: sessions.length };
}

async function main() {
  try {
    await connectDb();
    const counts = await seed();
    logger.info(
      `Seeded ${counts.teachers} teachers, ${counts.users} users, ${counts.sessions} sessions`,
    );
  } catch (err) {
    logger.error(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  } finally {
    await disconnectDb();
  }
}

void main();
