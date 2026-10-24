import {
  MenuItemRepository,
  type FindMenuItemsParams,
} from '../repositories/menuItemRepository.ts';
import type {
  CreateMenuItemInput,
  MenuItemDetailDto,
  UpdateMenuItemInput,
} from '../dtos/menuItemDto.ts';
import { AppError } from '../utils/http.ts';

type MenuRow = NonNullable<Awaited<ReturnType<MenuItemRepository['findById']>>>;

export class MenuItemService {
  private menuItemRepository: MenuItemRepository;

  constructor(menuItemRepository: MenuItemRepository = new MenuItemRepository()) {
    this.menuItemRepository = menuItemRepository;
  }

  private toDto(row: MenuRow): MenuItemDetailDto {
    return {
      id: row.id,
      name: row.name,
      price: row.price,
      isAvailable: Boolean(row.isAvailable),
      stall: {
        id: row.stallId,
        name: row.stallName,
        category: row.stallCategory,
        location: row.stallLocation,
      },
    };
  }

  async getAllMenuItems(params: FindMenuItemsParams) {
    const { rows, total } = await this.menuItemRepository.findAll(params);
    return { data: rows.map((row) => this.toDto(row)), total };
  }

  async getMenuItemById(id: number): Promise<MenuItemDetailDto> {
    const row = await this.menuItemRepository.findById(id);
    if (!row) throw new AppError(404, 'Data menu tidak ditemukan');
    return this.toDto(row);
  }

  async createMenuItem(input: CreateMenuItemInput): Promise<MenuItemDetailDto> {
    const created = await this.menuItemRepository.create(input);
    if (!created) throw new AppError(500, 'Gagal membuat menu');
    return this.getMenuItemById(created.id);
  }

  async updateMenuItem(id: number, input: UpdateMenuItemInput): Promise<MenuItemDetailDto> {
    const updated = await this.menuItemRepository.update(id, input);
    if (!updated) throw new AppError(404, 'Data menu tidak ditemukan');
    return this.getMenuItemById(id);
  }

  async deleteMenuItem(id: number): Promise<MenuItemDetailDto> {
    const existing = await this.getMenuItemById(id);
    const removed = await this.menuItemRepository.remove(id);
    if (!removed) throw new AppError(404, 'Data menu tidak ditemukan');
    return existing;
  }
}
