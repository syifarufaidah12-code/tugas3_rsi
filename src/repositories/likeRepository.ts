import { and, count, eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { likes, reviews } from '../db/schema.ts';
import type { CreateLikeInput } from '../dtos/likeDto.ts';

export class LikeRepository {
  async findById(id: number) {
    const db = await getDb();
    const rows = await db.select().from(likes).where(eq(likes.id, id));
    return rows[0];
  }

  async findByReviewAndUser(reviewId: number, userId: number) {
    const db = await getDb();
    const rows = await db
      .select()
      .from(likes)
      .where(and(eq(likes.reviewId, reviewId), eq(likes.userId, userId)));
    return rows[0];
  }

  async create(input: CreateLikeInput) {
    const db = await getDb();
    const rows = await db
      .insert(likes)
      .output()
      .values({ reviewId: input.reviewId, userId: input.userId });
    return rows[0];
  }

  async remove(id: number) {
    const db = await getDb();
    const rows = await db.delete(likes).where(eq(likes.id, id)).output();
    return rows[0];
  }

  // Hitung ulang like_count review dari tabel LIKES (aman dijalankan berulang).
  async syncReviewLikeCount(reviewId: number) {
    const db = await getDb();
    const totals = await db
      .select({ total: count() })
      .from(likes)
      .where(eq(likes.reviewId, reviewId));

    await db
      .update(reviews)
      .set({ likeCount: Number(totals[0]?.total ?? 0) })
      .where(eq(reviews.id, reviewId));
  }
}
