import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import { rateLimiter } from './middlewares/rateLimiter';
import { routes } from './routes';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(rateLimiter);
app.use(express.json({ limit: '100kb' }));

app.use(routes);

app.use(notFound);
app.use(errorHandler);
