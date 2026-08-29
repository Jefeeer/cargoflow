import type { NextFunction, Request, Response } from 'express';
import { contactSchema } from '../validation/schemas.js';
import { insertContact } from '../db/index.js';
import { sendContactNotification } from '../services/notificationService.js';
import type { ApiErrorResponse, ContactResponse } from '../types.js';

export function createContact(req: Request, res: Response, next: NextFunction): void {
  const parsed = contactSchema.safeParse(req.body);

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
    insertContact(parsed.data);
    sendContactNotification(parsed.data);

    const body: ContactResponse = { success: true, message: 'Message received.' };
    res.status(201).json(body);
  } catch (err) {
    next(err);
  }
}
