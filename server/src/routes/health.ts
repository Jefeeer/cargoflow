import { Router } from 'express';
import type { HealthResponse } from '../types.js';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  const body: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
  res.status(200).json(body);
});
