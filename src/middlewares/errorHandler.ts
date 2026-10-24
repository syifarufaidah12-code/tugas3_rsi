import type { NextFunction, Request, Response } from 'express';
import { sendError } from '../utils/http.ts';

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ status: 'fail', message: 'Endpoint tidak ditemukan' });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // Body JSON rusak (dari express.json) -> 400, bukan 500.
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ status: 'fail', message: 'Body request bukan JSON yang valid' });
  }
  return sendError(res, err);
}