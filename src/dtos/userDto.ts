import { AppError } from '../utils/http.ts';
import { asBody, reqString } from '../utils/validate.ts';

export const USER_ROLES = ['admin', 'owner', 'customer'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === 'string' && (USER_ROLES as readonly string[]).includes(value);
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

// Password sengaja tidak pernah masuk DTO response.
export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: Date | string | null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseCreateUser(raw: unknown): CreateUserInput {
  const body = asBody(raw);
  const name = reqString(body, 'name', 100);
  const email = reqString(body, 'email', 150).toLowerCase();
  if (!EMAIL_PATTERN.test(email)) throw new AppError(400, 'Format email tidak valid');

  const password = body.password;
  if (typeof password !== 'string' || password.length < 6 || password.length > 100) {
    throw new AppError(400, 'Field password wajib diisi (string 6 sampai 100 karakter)');
  }

  const role = body.role ?? 'customer';
  if (!isUserRole(role)) {
    throw new AppError(400, `Field role harus salah satu dari: ${USER_ROLES.join(', ')}`);
  }

  return { name, email, password, role };
}
