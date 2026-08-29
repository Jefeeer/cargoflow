import type { Request, Response } from 'express';
import type { ApiErrorResponse } from '../types.js';

export function notFound(_req: Request, res: Response): void {
  const body: ApiErrorResponse = { success: false, error: 'Not found.' };
  res.status(404).json(body);
}
