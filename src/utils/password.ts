import bcrypt from 'bcryptjs';

// Hash password dengan bcrypt (10 salt rounds). Hasilnya selalu 60 karakter.
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}