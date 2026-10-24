import { count, eq, sql } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { reviews, stalls } from '../db/schema.ts';

export interface CreateReviewRecord {
  stallId: number;
  userId: number;
  rating: number;
  comment: string | null;
}

export class StallReviewRepository {
  async create(record: CreateReviewRecord) {
    const db = await getDb();
    const rows = await db
      .insert(reviews)
      .output()
      .values({
        stallId: record.stallId,
        userId: record.userId,
        rating: record.rating,
        comment: record.comment,
        likeCount: 0,
      });
    return rows[0];
  }

  // Hitung ulang avg_rating dan review_count warung dari tabel REVIEWS.
  // CAST ke DECIMAL supaya AVG tidak dibulatkan ke integer oleh SQL Server.
  async refreshStallRating(stallId: number) {
    const db = await getDb();
    const result = await db
      .select({
        average: sql<string>`AVG(CAST(${reviews.rating} AS DECIMAL(10,2)))`,
        total: count(),
      })
      .from(reviews)
      .where(eq(reviews.stallId, stallId));

    const total = Number(result[0]?.total ?? 0);
    const average = total > 0 ? Number(result[0]?.average ?? 0) : 0;

    await db
      .update(stalls)
      .set({ avgRating: average.toFixed(2), reviewCount: total })
      .where(eq(stalls.id, stallId));
  }
}