import { count, desc, eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { flags, reviews, users } from '../db/schema.ts';

export interface FindFlagsParams {
  status?: string;
  page: number;
  limit: number;
}

// Kolom hasil JOIN flags + reviews + users (pelapor).
const flagDetail = {
  id: flags.id,
  reason: flags.reason,
  status: flags.status,
  createdAt: flags.createdAt,
  reviewId: reviews.id,
  reviewRating: reviews.rating,
  reviewComment: reviews.comment,
  reporterId: users.id,
  reporterName: users.name,
};

export class FlagRepository {
  async findAll(params: FindFlagsParams) {
    const db = await getDb();
    const where = params.status ? eq(flags.status, params.status) : undefined;
    const offset = (params.page - 1) * params.limit;

    const rows = await db
      .select(flagDetail)
      .from(flags)
      .innerJoin(reviews, eq(flags.reviewId, reviews.id))
      .innerJoin(users, eq(flags.reportedBy, users.id))
      .where(where)
      .orderBy(desc(flags.id))
      .offset(offset)
      .fetch(params.limit);

    const totals = await db.select({ total: count() }).from(flags).where(where);
    return { rows, total: Number(totals[0]?.total ?? 0) };
  }

  async findById(id: number) {
    const db = await getDb();
    const rows = await db
      .select(flagDetail)
      .from(flags)
      .innerJoin(reviews, eq(flags.reviewId, reviews.id))
      .innerJoin(users, eq(flags.reportedBy, users.id))
      .where(eq(flags.id, id));
    return rows[0];
  }

  async updateStatus(id: number, status: string) {
    const db = await getDb();
    const rows = await db.update(flags).set({ status }).where(eq(flags.id, id)).output();
    return rows[0];
  }
}
