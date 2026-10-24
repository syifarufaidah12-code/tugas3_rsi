import { z } from 'zod';

export const registerBodySchema = z.object({
  name: z
    .string({ required_error: 'name wajib diisi' })
    .trim()
    .min(3, 'name minimal 3 karakter')
    .max(100, 'name maksimal 100 karakter'),
  email: z
    .string({ required_error: 'email wajib diisi' })
    .trim()
    .toLowerCase()
    .email('format email tidak valid')
    .max(150, 'email maksimal 150 karakter'),
  password: z
    .string({ required_error: 'password wajib diisi' })
    .min(8, 'password minimal 8 karakter')
    .max(72, 'password maksimal 72 karakter'),
});

export const loginBodySchema = z.object({
  email: z
    .string({ required_error: 'email wajib diisi' })
    .trim()
    .toLowerCase()
    .email('format email tidak valid'),
  password: z.string({ required_error: 'password wajib diisi' }).min(1, 'password wajib diisi'),
});

export type RegisterBody = z.infer<typeof registerBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;