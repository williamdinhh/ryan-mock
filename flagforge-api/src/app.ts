import express, { Express } from 'express';
import flagsRouter from './routes/flags.routes';
import { errorHandler } from './middleware/errorHandler';

export function createApp(): Express {
  const app = express();
  app.use(express.json());

  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api/flags', flagsRouter);

  app.use(errorHandler);
  return app;
}
