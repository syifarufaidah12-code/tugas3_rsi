import { asBody, reqString } from '../utils/validate.ts';

export interface UpdateFlagStatusInput {
  status: string;
}

// Hasil JOIN FLAGS + REVIEWS + USERS (pelapor).
export interface FlagDetailDto {
  id: number;
  reason: string | null;
  status: string;
  createdAt: Date | string | null;
  reporter: {
    id: number;
    name: string;
  };
  review: {
    id: number;
    rating: number;
    comment: string | null;
  };
}

// Nilai status yang valid ditentukan oleh database (kolom varchar(20)); di sini cukup dicek bentuknya.
export function parseUpdateFlagStatus(raw: unknown): UpdateFlagStatusInput {
  const body = asBody(raw);
  return { status: reqString(body, 'status', 20) };
}
