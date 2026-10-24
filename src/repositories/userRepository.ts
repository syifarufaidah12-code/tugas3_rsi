import { count, eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { users } from '../db/schema.ts';
import type { UserRole } from '../dtos/userDto.ts';

export interface FindUsersParams {
  role?: UserRole;
  page: number;
  limit: number;
}

export interface CreateUserRecord {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

// Kolom yang boleh keluar dari repository: passwordHash sengaja tidak ikut.
const publicColumns = {
  id: users.id,
  name: users.name,
  email: users.email,
  role: users.role,
  createdAt: users.createdAt,
};

export class UserRepository {
  async findAll(params: FindUsersParams) {
    const db = await getDb();
    const where = params.role ? eq(users.role, params.role) : undefined;
    const offset = (params.page - 1) * params.limit;

    const rows = await db
      .select(publicColumns)
      .from(users)
      .where(where)
      .orderBy(users.id)
      .offset(offset)
      .fetch(params.limit);

    const totals = await db.select({ total: count() }).from(users).where(where);
    return { rows, total: Number(totals[0]?.total ?? 0) };
  }

  async findById(id: number) {
    const db = await getDb();
    const rows = await db.select(publicColumns).from(users).where(eq(users.id, id));
    return rows[0];
  }

  async findByEmail(email: string) {
    const db = await getDb();
    const rows = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
    return rows[0];
  }

  // Khusus login: ikut membawa passwordHash untuk dibandingkan. Jangan pernah dikirim ke client.
  async findAuthByEmail(email: string) {
    const db = await getDb();
    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        passwordHash: users.passwordHash,
      })
      .from(users)
      .where(eq(users.email, email));
    return rows[0];
  }

  async create(record: CreateUserRecord) {
    const db = await getDb();
    const rows = await db
      .insert(users)
      .output(publicColumns)
      .values({
        name: record.name,
        email: record.email,
        passwordHash: record.passwordHash,
        role: record.role,
      });
    return rows[0];
  }
}