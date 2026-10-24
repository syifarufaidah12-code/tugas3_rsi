import { z } from 'zod';

export const stallIdParamsSchema = z.object({
  id: z.coerce
    .number({ invalid_type_error: 'id harus berupa angka' })
    .int('id harus berupa bilangan bulat')
    .gt(0, 'id harus lebih dari 0'),
});

export const listStallsQuerySchema = z.object({
  search: z.string().trim().max(100, 'search maksimal 100 karakter').optional(),
  category: z.string().trim().max(50, 'category maksimal 50 karakter').optional(),
  page: z.coerce.number().int('page harus bilangan bulat').min(1, 'page minimal 1').default(1),
  limit: z.coerce
    .number()
    .int('limit harus bilangan bulat')
    .min(1, 'limit minimal 1')
    .max(100, 'limit maksimal 100')
    .default(10),
});

export const createStallBodySchema = z.object({
  name: z
    .string({ required_error: 'name wajib diisi' })
    .trim()
    .min(3, 'name minimal 3 karakter')
    .max(100, 'name maksimal 100 karakter'),
  category: z.string().trim().max(50, 'category maksimal 50 karakter').optional(),
  location: z.string().trim().max(100, 'location maksimal 100 karakter').optional(),
  description: z.string().max(1000, 'description maksimal 1000 karakter').optional(),
});

// PUT: versi parsial dari POST (semua field opsional).
export const updateStallBodySchema = createStallBodySchema.partial();