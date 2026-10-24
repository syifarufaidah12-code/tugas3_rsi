import 'dotenv/config';
import jwt from 'jsonwebtoken';
import type { Role } from '../middlewares/auth.ts';

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET belum diisi di file .env');
  return secret;
}

// Identitas (sub) dan role hanya dibaca dari token, bukan dari body request.
export function signToken(user: { id: number; role: Role }): string {
  return jwt.sign({ role: user.role }, getJwtSecret(), {
    subject: String(user.id),
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '1d') as jwt.SignOptions['expiresIn'],
  });
}