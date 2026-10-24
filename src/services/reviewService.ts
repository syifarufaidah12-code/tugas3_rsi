import { ReviewRepository, type FindReviewsParams } from '../repositories/reviewRepository.ts';
import type { CreateReviewInput, ReviewDetailDto } from '../dtos/reviewDto.ts';
import { AppError } from '../utils/http.ts';

type ReviewRow = NonNullable<Awaited<ReturnType<ReviewRepository['findById']>>>;

export class ReviewService {
  private reviewRepository: ReviewRepository;

  constructor(reviewRepository: ReviewRepository = new ReviewRepository()) {
    this.reviewRepository = reviewRepository;
  }

  private toDto(row: ReviewRow): ReviewDetailDto {
    return {
      id: row.id,
      stallId: row.stallId,
      rating: row.rating,
      comment: row.comment,
      likeCount: row.likeCount,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      user: { id: row.userId, name: row.userName },
    };
  }

  async getAllReviews(params: FindReviewsParams) {
    const { rows, total } = await this.reviewRepository.findAll(params);
    return { data: rows.map((row) => this.toDto(row)), total };
  }

  async getReviewById(id: number): Promise<ReviewDetailDto> {
    const row = await this.reviewRepository.findById(id);
    if (!row) throw new AppError(404, 'Data review tidak ditemukan');
    return this.toDto(row);
  }

  async createReview(input: CreateReviewInput): Promise<ReviewDetailDto> {
    const created = await this.reviewRepository.create(input);
    if (!created) throw new AppError(500, 'Gagal membuat review');

    // Logika bisnis: rating rata-rata & jumlah review warung ikut diperbarui.
    await this.reviewRepository.syncStallStats(input.stallId);
    return this.getReviewById(created.id);
  }

  async deleteReview(id: number): Promise<ReviewDetailDto> {
    const existing = await this.getReviewById(id);
    const removed = await this.reviewRepository.remove(id);
    if (!removed) throw new AppError(404, 'Data review tidak ditemukan');

    await this.reviewRepository.syncStallStats(existing.stallId);
    return existing;
  }
}
