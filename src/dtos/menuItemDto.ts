import { AppError } from '../utils/http.ts';
import { asBody, optBool, optInt, optString, reqInt, reqString } from '../utils/validate.ts';

export interface CreateMenuItemInput {
  stallId: number;
  name: string;
  price: number;
  isAvailable: boolean;
}

export type UpdateMenuItemInput = Partial<CreateMenuItemInput>;

// Hasil JOIN MENU_ITEMS + STALLS.
export interface MenuItemDetailDto {
  id: number;
  name: string;
  price: number;
  isAvailable: boolean;
  stall: {
    id: number;
    name: string;
    category: string | null;
    location: string | null;
  };
}

export function parseCreateMenuItem(raw: unknown): CreateMenuItemInput {
  const body = asBody(raw);
  return {
    stallId: reqInt(body, 'stallId'),
    name: reqString(body, 'name', 100),
    price: reqInt(body, 'price', 0),
    isAvailable: optBool(body, 'isAvailable') ?? true,
  };
}

export function parseUpdateMenuItem(raw: unknown): UpdateMenuItemInput {
  const body = asBody(raw);
  const input: UpdateMenuItemInput = {};

  const stallId = optInt(body, 'stallId');
  if (stallId !== undefined) input.stallId = stallId;

  const name = optString(body, 'name', 100);
  if (name === null) throw new AppError(400, 'Field name tidak boleh kosong');
  if (name !== undefined) input.name = name;

  const price = optInt(body, 'price', 0);
  if (price !== undefined) input.price = price;

  const isAvailable = optBool(body, 'isAvailable');
  if (isAvailable !== undefined) input.isAvailable = isAvailable;

  if (Object.keys(input).length === 0) {
    throw new AppError(400, 'Kirim minimal satu field: stallId, name, price, isAvailable');
  }
  return input;
}
