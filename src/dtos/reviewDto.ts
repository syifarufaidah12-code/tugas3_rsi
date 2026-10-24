import { asBody, optString, reqInt } from '../utils/validate.ts';

export interface CreateReviewInput {
  stallId: number;
  userId: number;
  rating: number;
  comment: string | null;
}

// Hasil JOIN REVIEWS + USERS.
export interface ReviewDetailDto {
  id: number;
  stallId: number;
  rating: number;
  comment: string | null;
  likeCount: number;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
  user: {
    id: number;
    name: string;
  };
}

export function parseCreateReview(raw: unknown): CreateReviewInput {
  const body = asBody(raw);
  return {
    stallId: reqInt(body, 'stallId'),
    userId: reqInt(body, 'userId'),
    rating: reqInt(body, 'rating', 1, 5),
    comment: optString(body, 'comment', 4000) ?? null,
  };
}
