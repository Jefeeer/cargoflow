import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { createQuote } from '../controllers/quoteController.js';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

export const quotesRouter = Router();

quotesRouter.post('/', limiter, createQuote);
