import { FlagRepository, type FindFlagsParams } from '../repositories/flagRepository.ts';
import type { FlagDetailDto } from '../dtos/flagDto.ts';
import { AppError } from '../utils/http.ts';

type FlagRow = NonNullable<Awaited<ReturnType<FlagRepository['findById']>>>;

export class FlagService {
  private flagRepository: FlagRepository;

  constructor(flagRepository: FlagRepository = new FlagRepository()) {
    this.flagRepository = flagRepository;
  }

  private toDto(row: FlagRow): FlagDetailDto {
    return {
      id: row.id,
      reason: row.reason,
      status: row.status,
      createdAt: row.createdAt,
      reporter: { id: row.reporterId, name: row.reporterName },
      review: { id: row.reviewId, rating: row.reviewRating, comment: row.reviewComment },
    };
  }

  async getAllFlags(params: FindFlagsParams) {
    const { rows, total } = await this.flagRepository.findAll(params);
    return { data: rows.map((row) => this.toDto(row)), total };
  }

  async getFlagById(id: number): Promise<FlagDetailDto> {
    const row = await this.flagRepository.findById(id);
    if (!row) throw new AppError(404, 'Data laporan (flag) tidak ditemukan');
    return this.toDto(row);
  }

  async updateFlagStatus(id: number, status: string): Promise<FlagDetailDto> {
    const updated = await this.flagRepository.updateStatus(id, status);
    if (!updated) throw new AppError(404, 'Data laporan (flag) tidak ditemukan');
    return this.getFlagById(id);
  }
}
