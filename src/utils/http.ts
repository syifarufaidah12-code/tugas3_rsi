import type { Response } from 'express';

export interface ErrorDetail {
  field: string;
  message: string;
}

// Error yang sengaja dilempar aplikasi (validasi gagal, data tidak ditemukan, dll).
export class AppError extends Error {
  statusCode: number;
  errors?: ErrorDetail[];

  constructor(statusCode: number, message: string, errors?: ErrorDetail[]) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

// 400: validasi input gagal (daftar field + pesan).
export class ValidationError extends AppError {
  constructor(errors: ErrorDetail[], message = 'Validasi gagal') {
    super(400, message, errors);
    this.name = 'ValidationError';
  }
}

// 401: belum login / token tidak valid.
export class UnauthorizedError extends AppError {
  constructor(message = 'Autentikasi diperlukan') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}

// 403: sudah login, tetapi tidak punya akses.
export class ForbiddenError extends AppError {
  constructor(message = 'Anda tidak memiliki akses ke resource ini') {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}

export function parseId(value: unknown, label = 'ID'): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, `${label} harus berupa angka bulat positif`);
  }
  return id;
}

export interface Pagination {
  page: number;
  limit: number;
}

export function parsePagination(query: Record<string, unknown>): Pagination {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);
  if (!Number.isInteger(page) || page < 1) {
    throw new AppError(400, 'Parameter page harus bilangan bulat >= 1');
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new AppError(400, 'Parameter limit harus bilangan bulat 1 sampai 100');
  }
  return { page, limit };
}

// Query string opsional: kosong / tidak dikirim -> undefined.
export function queryString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
}

export function queryId(value: unknown, label: string): number | undefined {
  if (value === undefined || value === '') return undefined;
  return parseId(value, label);
}

export function queryBool(value: unknown, label: string): boolean | undefined {
  if (value === undefined || value === '') return undefined;
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  throw new AppError(400, `Parameter ${label} harus true atau false`);
}

// Ambil nomor error SQL Server (mis. 547 = FK, 2627 = duplikat) dari error yang terbungkus.
function sqlErrorNumber(error: unknown): number | undefined {
  let current: any = error;
  for (let i = 0; i < 5 && current; i++) {
    const n = current.number ?? current.originalError?.info?.number ?? current.originalError?.number;
    if (typeof n === 'number') return n;
    current = current.cause;
  }
  return undefined;
}

function allMessages(error: unknown): string {
  const parts: string[] = [];
  let current: any = error;
  for (let i = 0; i < 5 && current; i++) {
    if (typeof current.message === 'string') parts.push(current.message);
    current = current.cause;
  }
  return parts.join(' | ');
}

// Satu pintu untuk semua error -> response JSON standar.
export function sendError(res: Response, error: unknown): Response {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'fail',
      message: error.message,
      ...(error.errors ? { errors: error.errors } : {}),
    });
  }

  const sqlNumber = sqlErrorNumber(error);
  const text = allMessages(error);

  if (sqlNumber === 547) {
    if (/DELETE/i.test(text)) {
      return res.status(409).json({
        status: 'fail',
        message: 'Data tidak bisa dihapus karena masih dipakai data lain',
      });
    }
    return res.status(400).json({
      status: 'fail',
      message: 'Data referensi (foreign key) tidak ditemukan atau nilai melanggar aturan tabel',
    });
  }

  if (sqlNumber === 2627 || sqlNumber === 2601) {
    return res.status(409).json({ status: 'fail', message: 'Data duplikat, nilai sudah dipakai' });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Terjadi kesalahan pada server',
    error: text || String(error),
  });
}