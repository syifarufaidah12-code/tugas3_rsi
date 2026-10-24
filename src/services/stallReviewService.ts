import { StallRepository } from '../repositories/stallRepository.ts';
import { StallReviewRepository } from '../repositories/stallReviewRepository.ts';
import { AppError } from '../utils/http.ts';

export class StallReviewService {
  private stallRepository: StallRepository;
  private reviewRepository: StallReviewRepository;

  constructor(
    stallRepository: StallRepository = new StallRepository(),
    reviewRepository: StallReviewRepository = new StallReviewRepository(),
  ) {
    this.stallRepository = stallRepository;
    this.reviewRepository = reviewRepository;
  }

  // userId berasal dari token (authenticate), bukan dari body request.
  async createForStall(
    stallId: number,
    userId: number,
    input: { rating: number; comment?: string },
  ) {
    const stall = await this.stallRepository.findById(stallId);
    if (!stall) throw new AppError(404, 'Data warung tidak ditemukan');

    const row = await this.reviewRepository.create({
      stallId,
      userId,
      rating: input.rating,
      comment: input.comment ?? null,
    });
    if (!row) throw new AppError(500, 'Gagal membuat review');

    await this.reviewRepository.refreshStallRating(stallId);
    return row;
  }
}