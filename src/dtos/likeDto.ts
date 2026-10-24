import { asBody, reqInt } from '../utils/validate.ts';

export interface CreateLikeInput {
  reviewId: number;
  userId: number;
}

export interface LikeResponseDto {
  id: number;
  reviewId: number;
  userId: number;
  createdAt: Date | string | null;
}

export function parseCreateLike(raw: unknown): CreateLikeInput {
  const body = asBody(raw);
  return {
    reviewId: reqInt(body, 'reviewId'),
    userId: reqInt(body, 'userId'),
  };
}
