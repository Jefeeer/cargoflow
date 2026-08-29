import type { NextFunction, Request, Response } from 'express';
import { quoteSchema } from '../validation/schemas.js';
import { insertQuote } from '../db/index.js';
import { nextReferenceNumber } from '../services/referenceService.js';
import { sendQuoteNotification } from '../services/notificationService.js';
import type { ApiErrorResponse, QuoteResponse } from '../types.js';

export function createQuote(req: Request, res: Response, next: NextFunction): void {
  const parsed = quoteSchema.safeParse(req.body);

  if (!parsed.success) {
    const body: ApiErrorResponse = {
      success: false,
      error: 'Validation failed.',
      fields: parsed.error.issues.map((issue) => ({
        field: issue.path.join('.') || 'body',
        message: issue.message,
      })),
    };
    res.status(400).json(body);
    return;
  }

  try {
    const referenceNumber = nextReferenceNumber();
    insertQuote({ ...parsed.data, referenceNumber });
    sendQuoteNotification(referenceNumber, parsed.data);

    const body: QuoteResponse = {
      success: true,
      referenceNumber,
      message: 'Quote request received.',
    };
    res.status(201).json(body);
  } catch (err) {
    next(err);
  }
}
