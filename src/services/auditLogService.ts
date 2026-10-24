import {
  AuditLogRepository,
  type FindAuditLogsParams,
} from '../repositories/auditLogRepository.ts';
import type { AuditLogDetailDto, CreateAuditLogInput } from '../dtos/auditLogDto.ts';
import { AppError } from '../utils/http.ts';

type AuditRow = NonNullable<Awaited<ReturnType<AuditLogRepository['findById']>>>;

export class AuditLogService {
  private auditLogRepository: AuditLogRepository;

  constructor(auditLogRepository: AuditLogRepository = new AuditLogRepository()) {
    this.auditLogRepository = auditLogRepository;
  }

  private toDto(row: AuditRow): AuditLogDetailDto {
    return {
      id: row.id,
      action: row.action,
      targetTable: row.targetTable,
      targetId: row.targetId,
      metadata: row.metadata,
      createdAt: row.createdAt,
      user: { id: row.userId, name: row.userName },
    };
  }

  async getAllAuditLogs(params: FindAuditLogsParams) {
    const { rows, total } = await this.auditLogRepository.findAll(params);
    return { data: rows.map((row) => this.toDto(row)), total };
  }

  async getAuditLogById(id: number): Promise<AuditLogDetailDto> {
    const row = await this.auditLogRepository.findById(id);
    if (!row) throw new AppError(404, 'Data audit log tidak ditemukan');
    return this.toDto(row);
  }

  async createAuditLog(input: CreateAuditLogInput): Promise<AuditLogDetailDto> {
    const created = await this.auditLogRepository.create(input);
    if (!created) throw new AppError(500, 'Gagal membuat audit log');
    return this.getAuditLogById(created.id);
  }
}
