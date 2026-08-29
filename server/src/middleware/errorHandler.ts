import type { NextFunction, Request, Response } from 'express';
import { isProduction } from '../config.js';
import type { ApiErrorResponse } from '../types.js';

// Centralized error handler. Body-parser attaches a client-error status/type to
// its errors (400 for malformed JSON, 413 for oversized bodies); honor that
// instead of collapsing every failure into a 500.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  const raw = err as { status?: number; statusCode?: number; type?: string } | undefined;
  const declared = raw?.status ?? raw?.statusCode;
  // Trust a caller-facing 4xx from body-parser (or any middleware); ignore 5xx.
  const isClientError = typeof declared === 'number' && declared >= 400 && declared < 500;

  let status = 500;
  let message = isProduction ? 'Internal server error.' : 'Internal server error.';

  if (isClientError) {
    status = declared as number;
    if (err instanceof SyntaxError) {
      message = 'Malformed JSON body.';
    } else if (raw?.type === 'entity.too.large' || status === 413) {
      message = 'Request body too large.';
    } else if (err instanceof Error) {
      message = err.message; // body-parser messages here are safe, caller-facing text
    } else {
      message = 'Bad request.';
    }
  } else if (!isProduction && err instanceof Error) {
    message = err.message;
  }

  if (!isClientError) {
    console.error(err);
  }

  const body: ApiErrorResponse = { success: false, error: message };
  res.status(status).json(body);
}
