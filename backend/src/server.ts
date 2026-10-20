import { app } from './app';
import { connectDb, disconnectDb } from './config/db';
import { env } from './config/env';
import { logger } from './utils/logger';

async function main() {
  try {
    await connectDb();
  } catch (err) {
    logger.error(`MongoDB connection failed: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }

  const server = app.listen(env.PORT, () => {
    logger.info(`Listening on port ${env.PORT} (${env.NODE_ENV})`);
  });

  async function shutdown(signal: string) {
    logger.info(`${signal} received, shutting down`);
    server.close();
    await disconnectDb();
    process.exit(0);
  }

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

void main();
