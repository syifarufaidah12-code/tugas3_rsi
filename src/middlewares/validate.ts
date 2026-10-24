import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodTypeAny } from 'zod';
import { ValidationError, type ErrorDetail } from '../utils/http.ts';

export type RequestSource = 'body' | 'query' | 'params';

/**
 * Middleware validasi berbasis schema zod.
 * Hasil parse yang sukses disimpan di res.locals.validated[source],
 * dibaca controller lewat getValidated().
 */
export function validate(schema: ZodTypeAny, source: RequestSource): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors: ErrorDetail[] = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || source,
        message: issue.message,
      }));
      return next(new ValidationError(errors));
    }

    const validated = (res.locals.validated ?? {}) as Record<RequestSource, unknown>;
    validated[source] = result.data;
    res.locals.validated = validated;
    return next();
  };
}

/** Mengambil data hasil validasi dari satu sumber request di controller. */
export function getValidated<T>(res: Response, source: RequestSource): T {
  const validated = (res.locals.validated ?? {}) as Record<RequestSource, unknown>;
  return validated[source] as T;
}