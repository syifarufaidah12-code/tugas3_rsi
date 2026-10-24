import type { NextFunction, Request, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ForbiddenError, UnauthorizedError } from '../utils/http.ts';
import { getJwtSecret } from '../utils/token.ts';

export type Role = 'admin' | 'owner' | 'customer';

export interface AuthUser {
  id: number;
  role: Role;
}

const ROLES: Role[] = ['admin', 'owner', 'customer'];

// 401: token tidak ada / tidak valid / kedaluwarsa.
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Token tidak ditemukan'));
  }

  try {
    const payload = jwt.verify(header.slice(7).trim(), getJwtSecret());
    if (typeof payload === 'string') throw new Error('payload tidak valid');

    const id = Number(payload.sub);
    const role = payload.role as Role;
    if (!Number.isInteger(id) || !ROLES.includes(role)) throw new Error('payload tidak valid');

    res.locals.user = { id, role } satisfies AuthUser;
    return next();
  } catch {
    return next(new UnauthorizedError('Token tidak valid atau sudah kedaluwarsa'));
  }
}

// 403: sudah login, tetapi role tidak termasuk yang diizinkan.
// Selalu pasang SETELAH authenticate.
export function authorize(...roles: Role[]): RequestHandler {
  return (_req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user as AuthUser | undefined;
    if (!user) return next(new UnauthorizedError());
    if (!roles.includes(user.role)) {
      return next(new ForbiddenError('Role Anda tidak diizinkan mengakses endpoint ini'));
    }
    return next();
  };
}

/** Mengambil user yang sedang login (hasil authenticate) di controller. */
export function getUser(res: Response): AuthUser {
  return res.locals.user as AuthUser;
}