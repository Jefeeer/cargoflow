import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config.js';
import { healthRouter } from './routes/health.js';
import { quotesRouter } from './routes/quotes.js';
import { contactRouter } from './routes/contact.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json({ limit: '100kb' }));

  app.use('/api/health', healthRouter);
  app.use('/api/quotes', quotesRouter);
  app.use('/api/contact', contactRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
