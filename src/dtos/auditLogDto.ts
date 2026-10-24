import { AppError } from '../utils/http.ts';
import { asBody, reqInt, reqString } from '../utils/validate.ts';

export interface CreateAuditLogInput {
  userId: number;
  action: string;
  targetTable: string;
  targetId: number;
  metadata: string | null;
}

// Hasil JOIN AUDIT_LOGS + USERS.
export interface AuditLogDetailDto {
  id: number;
  action: string;
  targetTable: string;
  targetId: number;
  metadata: string | null;
  createdAt: Date | string | null;
  user: {
    id: number;
    name: string;
  };
}

export function parseCreateAuditLog(raw: unknown): CreateAuditLogInput {
  const body = asBody(raw);

  // metadata boleh berupa object JSON atau string; disimpan sebagai teks.
  let metadata: string | null = null;
  if (body.metadata !== undefined && body.metadata !== null) {
    metadata = typeof body.metadata === 'string' ? body.metadata : JSON.stringify(body.metadata);
    if (metadata.length > 4000) throw new AppError(400, 'Field metadata maksimal 4000 karakter');
  }

  return {
    userId: reqInt(body, 'userId'),
    action: reqString(body, 'action', 50),
    targetTable: reqString(body, 'targetTable', 50),
    targetId: reqInt(body, 'targetId'),
    metadata,
  };
}
