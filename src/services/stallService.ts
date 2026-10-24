import {
  StallRepository,
  type CreateStallInput,
  type FindAllParams,
} from '../repositories/stallRepository.ts';
import { MenuItemRepository } from '../repositories/menuItemRepository.ts';
import type { MenuItemDto, StallResponseDto } from '../dtos/stallDto.ts';
import type { AuthUser } from '../middlewares/auth.ts';
import { AppError, ForbiddenError } from '../utils/http.ts';

type StallRow = NonNullable<Awaited<ReturnType<StallRepository['findById']>>>;

export class StallService {
  private stallRepository: StallRepository;
  private menuItemRepository: MenuItemRepository;

  constructor(
    stallRepository: StallRepository = new StallRepository(),
    menuItemRepository: MenuItemRepository = new MenuItemRepository(),
  ) {
    this.stallRepository = stallRepository;
    this.menuItemRepository = menuItemRepository;
  }

  // Mapping row DB -> DTO API (sekaligus logika bisnis isPopular).
  private toDto(row: StallRow): StallResponseDto {
    const avgRating = Number(row.avgRating);
    return {
      id: row.id,
      ownerId: row.ownerId,
      name: row.name,
      category: row.category,
      location: row.location,
      description: row.description,
      avgRating,
      reviewCount: row.reviewCount,
      isPopular: avgRating >= 4.7,
    };
  }

  async getAllStalls(params: FindAllParams) {
    const { rows, total } = await this.stallRepository.findAll(params);
    return { data: rows.map((row) => this.toDto(row)), total };
  }

  async getStallById(id: number): Promise<StallResponseDto> {
    const row = await this.stallRepository.findById(id);
    if (!row) throw new AppError(404, 'Data warung tidak ditemukan');
    return this.toDto(row);
  }

  async getStallMenus(id: number): Promise<MenuItemDto[]> {
    const row = await this.stallRepository.findById(id);
    if (!row) throw new AppError(404, 'Data warung tidak ditemukan');
    return this.menuItemRepository.findByStallId(id);
  }

  // ownerId selalu diambil dari token user yang sedang login.
  async createStall(
    input: Omit<CreateStallInput, 'ownerId'>,
    user: AuthUser,
  ): Promise<StallResponseDto> {
    const row = await this.stallRepository.create({ ...input, ownerId: user.id });
    if (!row) throw new AppError(500, 'Gagal membuat warung');
    return this.toDto(row);
  }

  async updateStall(
    id: number,
    input: Partial<Omit<CreateStallInput, 'ownerId'>>,
    user: AuthUser,
  ): Promise<StallResponseDto> {
    const existing = await this.stallRepository.findById(id);
    if (!existing) throw new AppError(404, 'Data warung tidak ditemukan');

    // Owner hanya boleh mengubah warung miliknya sendiri. Admin boleh semua.
    if (user.role === 'owner' && existing.ownerId !== user.id) {
      throw new ForbiddenError('Anda hanya boleh mengubah warung milik sendiri');
    }

    const row = await this.stallRepository.update(id, input);
    if (!row) throw new AppError(404, 'Data warung tidak ditemukan');
    return this.toDto(row);
  }

  async deleteStall(id: number): Promise<StallResponseDto> {
    const row = await this.stallRepository.remove(id);
    if (!row) throw new AppError(404, 'Data warung tidak ditemukan');
    return this.toDto(row);
  }
}