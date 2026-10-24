import { and, count, eq, like, type SQL } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { menuItems, stalls } from '../db/schema.ts';
import type { CreateMenuItemInput, UpdateMenuItemInput } from '../dtos/menuItemDto.ts';

export interface FindMenuItemsParams {
  stallId?: number;
  search?: string;
  isAvailable?: boolean;
  page: number;
  limit: number;
}

// Kolom hasil JOIN menu_items + stalls.
const menuWithStall = {
  id: menuItems.id,
  name: menuItems.name,
  price: menuItems.price,
  isAvailable: menuItems.isAvailable,
  stallId: stalls.id,
  stallName: stalls.name,
  stallCategory: stalls.category,
  stallLocation: stalls.location,
};

export class MenuItemRepository {
  async findAll(params: FindMenuItemsParams) {
    const db = await getDb();

    const conditions: SQL[] = [];
    if (params.stallId !== undefined) conditions.push(eq(menuItems.stallId, params.stallId));
    if (params.search) conditions.push(like(menuItems.name, `%${params.search}%`));
    if (params.isAvailable !== undefined) {
      conditions.push(eq(menuItems.isAvailable, params.isAvailable));
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const offset = (params.page - 1) * params.limit;

    const rows = await db
      .select(menuWithStall)
      .from(menuItems)
      .innerJoin(stalls, eq(menuItems.stallId, stalls.id))
      .where(where)
      .orderBy(menuItems.id)
      .offset(offset)
      .fetch(params.limit);

    const totals = await db.select({ total: count() }).from(menuItems).where(where);
    return { rows, total: Number(totals[0]?.total ?? 0) };
  }

  async findById(id: number) {
    const db = await getDb();
    const rows = await db
      .select(menuWithStall)
      .from(menuItems)
      .innerJoin(stalls, eq(menuItems.stallId, stalls.id))
      .where(eq(menuItems.id, id));
    return rows[0];
  }

  // Dipakai StallService untuk GET /stalls/:id/menus.
  async findByStallId(stallId: number) {
    const db = await getDb();
    return db.select().from(menuItems).where(eq(menuItems.stallId, stallId)).orderBy(menuItems.id);
  }

  async create(input: CreateMenuItemInput) {
    const db = await getDb();
    const rows = await db
      .insert(menuItems)
      .output()
      .values({
        stallId: input.stallId,
        name: input.name,
        price: input.price,
        isAvailable: input.isAvailable,
      });
    return rows[0];
  }

  async update(id: number, input: UpdateMenuItemInput) {
    const db = await getDb();
    const rows = await db
      .update(menuItems)
      .set({
        ...(input.stallId !== undefined ? { stallId: input.stallId } : {}),
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.price !== undefined ? { price: input.price } : {}),
        ...(input.isAvailable !== undefined ? { isAvailable: input.isAvailable } : {}),
      })
      .where(eq(menuItems.id, id))
      .output();
    return rows[0];
  }

  async remove(id: number) {
    const db = await getDb();
    const rows = await db.delete(menuItems).where(eq(menuItems.id, id)).output();
    return rows[0];
  }
}
