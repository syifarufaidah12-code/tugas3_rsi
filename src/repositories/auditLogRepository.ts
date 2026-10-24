import { and, count, desc, eq, type SQL } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { auditLogs, users } from '../db/schema.ts';
import type { CreateAuditLogInput } from '../dtos/auditLogDto.ts';

export interface FindAuditLogsParams {
  userId?: number;
  action?: string;
  targetTable?: string;
  page: number;
  limit: number;
}

// Kolom hasil JOIN audit_logs + users.
const auditWithUser = {
  id: auditLogs.id,
  action: auditLogs.action,
  targetTable: auditLogs.targetTable,
  targetId: auditLogs.targetId,
  metadata: auditLogs.metadata,
  createdAt: auditLogs.createdAt,
  userId: users.id,
  userName: users.name,
};

export class AuditLogRepository {
  async findAll(params: FindAuditLogsParams) {
    const db = await getDb();

    const conditions: SQL[] = [];
    if (params.userId !== undefined) conditions.push(eq(auditLogs.userId, params.userId));
    if (params.action) conditions.push(eq(auditLogs.action, params.action));
    if (params.targetTable) conditions.push(eq(auditLogs.targetTable, params.targetTable));
    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const offset = (params.page - 1) * params.limit;

    const rows = await db
      .select(auditWithUser)
      .from(auditLogs)
      .innerJoin(users, eq(auditLogs.userId, users.id))
      .where(where)
      .orderBy(desc(auditLogs.id))
      .offset(offset)
      .fetch(params.limit);

    const totals = await db.select({ total: count() }).from(auditLogs).where(where);
    return { rows, total: Number(totals[0]?.total ?? 0) };
  }

  async findById(id: number) {
    const db = await getDb();
    const rows = await db
      .select(auditWithUser)
      .from(auditLogs)
      .innerJoin(users, eq(auditLogs.userId, users.id))
      .where(eq(auditLogs.id, id));
    return rows[0];
  }

  async create(input: CreateAuditLogInput) {
    const db = await getDb();
    const rows = await db
      .insert(auditLogs)
      .output()
      .values({
        userId: input.userId,
        action: input.action,
        targetTable: input.targetTable,
        targetId: input.targetId,
        metadata: input.metadata,
      });
    return rows[0];
  }
}
