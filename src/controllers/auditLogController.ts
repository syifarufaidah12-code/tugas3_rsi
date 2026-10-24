import type { Request, Response } from 'express';
import { AuditLogService } from '../services/auditLogService.ts';
import { parseCreateAuditLog } from '../dtos/auditLogDto.ts';
import { parseId, parsePagination, queryId, queryString, sendError } from '../utils/http.ts';

export class AuditLogController {
  private auditLogService: AuditLogService;

  constructor(auditLogService: AuditLogService = new AuditLogService()) {
    this.auditLogService = auditLogService;
  }

  getAuditLogs = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { page, limit } = parsePagination(req.query);
      const { data, total } = await this.auditLogService.getAllAuditLogs({
        userId: queryId(req.query.userId, 'userId'),
        action: queryString(req.query.action),
        targetTable: queryString(req.query.targetTable),
        page,
        limit,
      });
      return res.status(200).json({ status: 'success', meta: { page, limit, total }, data });
    } catch (error) {
      return sendError(res, error);
    }
  };

  getAuditLogById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const log = await this.auditLogService.getAuditLogById(parseId(req.params.id, 'ID audit log'));
      return res.status(200).json({ status: 'success', data: log });
    } catch (error) {
      return sendError(res, error);
    }
  };

  createAuditLog = async (req: Request, res: Response): Promise<Response> => {
    try {
      const log = await this.auditLogService.createAuditLog(parseCreateAuditLog(req.body));
      return res.status(201).json({ status: 'success', data: log });
    } catch (error) {
      return sendError(res, error);
    }
  };
}
