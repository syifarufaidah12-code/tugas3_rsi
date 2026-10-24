import { AppError } from './http.ts';

export type Body = Record<string, unknown>;

export function asBody(raw: unknown): Body {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new AppError(400, 'Body request harus berupa JSON object');
  }
  return raw as Body;
}

export function reqString(body: Body, key: string, max: number): string {
  const value = body[key];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new AppError(400, `Field ${key} wajib diisi (string)`);
  }
  const text = value.trim();
  if (text.length > max) throw new AppError(400, `Field ${key} maksimal ${max} karakter`);
  return text;
}

// undefined = field tidak dikirim, null = sengaja dikosongkan.
export function optString(body: Body, key: string, max: number): string | null | undefined {
  const value = body[key];
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== 'string') throw new AppError(400, `Field ${key} harus berupa string`);
  const text = value.trim();
  if (text.length > max) throw new AppError(400, `Field ${key} maksimal ${max} karakter`);
  return text === '' ? null : text;
}

export function reqInt(body: Body, key: string, min = 1, max = 2147483647): number {
  const value = body[key];
  if (typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max) {
    throw new AppError(400, `Field ${key} wajib berupa bilangan bulat ${min} sampai ${max}`);
  }
  return value;
}

export function optInt(body: Body, key: string, min = 1, max = 2147483647): number | undefined {
  if (body[key] === undefined) return undefined;
  return reqInt(body, key, min, max);
}

export function optBool(body: Body, key: string): boolean | undefined {
  const value = body[key];
  if (value === undefined) return undefined;
  if (typeof value !== 'boolean') throw new AppError(400, `Field ${key} harus true atau false`);
  return value;
}
