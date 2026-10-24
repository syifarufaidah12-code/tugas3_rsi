import { LikeRepository } from '../repositories/likeRepository.ts';
import type { CreateLikeInput, LikeResponseDto } from '../dtos/likeDto.ts';
import { AppError } from '../utils/http.ts';

type LikeRow = NonNullable<Awaited<ReturnType<LikeRepository['findById']>>>;

export class LikeService {
  private likeRepository: LikeRepository;

  constructor(likeRepository: LikeRepository = new LikeRepository()) {
    this.likeRepository = likeRepository;
  }

  private toDto(row: LikeRow): LikeResponseDto {
    return {
      id: row.id,
      reviewId: row.reviewId,
      userId: row.userId,
      createdAt: row.createdAt,
    };
  }

  async createLike(input: CreateLikeInput): Promise<LikeResponseDto> {
    // Satu user hanya boleh menyukai satu review sekali.
    const existing = await this.likeRepository.findByReviewAndUser(input.reviewId, input.userId);
    if (existing) throw new AppError(409, 'User sudah menyukai review ini');

    const created = await this.likeRepository.create(input);
    if (!created) throw new AppError(500, 'Gagal membuat like');

    await this.likeRepository.syncReviewLikeCount(input.reviewId);
    return this.toDto(created);
  }

  async deleteLike(id: number): Promise<LikeResponseDto> {
    const existing = await this.likeRepository.findById(id);
    if (!existing) throw new AppError(404, 'Data like tidak ditemukan');

    await this.likeRepository.remove(id);
    await this.likeRepository.syncReviewLikeCount(existing.reviewId);
    return this.toDto(existing);
  }
}
