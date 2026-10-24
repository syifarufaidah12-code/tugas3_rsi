import { and, count, desc, eq, sql, type SQL } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { flags, likes, reviews, stalls, users } from '../db/schema.ts';
import type { CreateReviewInput } from '../dtos/reviewDto.ts';

export interface FindReviewsParams {
  stallId?: number;
  userId?: number;
  page: number;
  limit: number;
}

// Kolom hasil JOIN reviews + users.
const reviewWithUser = {
  id: reviews.id,
  stallId: reviews.stallId,
  rating: reviews.rating,
  comment: reviews.comment,
  likeCount: reviews.likeCount,
  createdAt: reviews.createdAt,
  updatedAt: reviews.updatedAt,
  userId: users.id,
  userName: users.name,
};

export class ReviewRepository {
  async findAll(params: FindReviewsParams) {
    const db = await getDb();

    const conditions: SQL[] = [];
    if (params.stallId !== undefined) conditions.push(eq(reviews.stallId, params.stallId));
    if (params.userId !== undefined) conditions.push(eq(reviews.userId, params.userId));
    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const offset = (params.page - 1) * params.limit;

    const rows = await db
      .select(reviewWithUser)
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(where)
      .orderBy(desc(reviews.id))
      .offset(offset)
      .fetch(params.limit);

    const totals = await db.select({ total: count() }).from(reviews).where(where);
    return { rows, total: Number(totals[0]?.total ?? 0) };
  }

  async findById(id: number) {
    const db = await getDb();
    const rows = await db
      .select(reviewWithUser)
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.id, id));
    return rows[0];
  }

  async create(input: CreateReviewInput) {
    const db = await getDb();
    const rows = await db
      .insert(reviews)
      .output()
      .values({
        stallId: input.stallId,
        userId: input.userId,
        rating: input.rating,
        comment: input.comment,
        likeCount: 0,
      });
    return rows[0];
  }

  // LIKES dan FLAGS punya foreign key ke review, jadi harus dibersihkan dulu sebelum review dihapus.
  async remove(id: number) {
    const db = await getDb();
    await db.delete(likes).where(eq(likes.reviewId, id));
    await db.delete(flags).where(eq(flags.reviewId, id));
    const rows = await db.delete(reviews).where(eq(reviews.id, id)).output();
    return rows[0];
  }

  // Hitung ulang avg_rating dan review_count warung dari tabel REVIEWS (aman dijalankan berulang).
  async syncStallStats(stallId: number) {
    const db = await getDb();
    const stats = await db
      .select({
        avgRating: sql<string | null>`AVG(CAST(${reviews.rating} AS DECIMAL(5,2)))`,
        total: count(),
      })
      .from(reviews)
      .where(eq(reviews.stallId, stallId));

    const avgRating = Number(stats[0]?.avgRating ?? 0);
    const total = Number(stats[0]?.total ?? 0);

    await db
      .update(stalls)
      .set({ avgRating: avgRating.toFixed(2), reviewCount: total })
      .where(eq(stalls.id, stallId));
  }
}
