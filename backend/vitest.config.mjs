import { defineConfig } from 'vitest/config';

process.env.MONGODB_URI ??= 'mongodb://127.0.0.1:27017/session_booking_test';
process.env.CORS_ORIGIN ??= 'http://localhost:5173';

export default defineConfig({
  test: {
    environment: 'node',
    fileParallelism: false,
    hookTimeout: 180_000,
    testTimeout: 20_000,
  },
});
