import type { Request, Response } from 'express';
import { FlagService } from '../services/flagService.ts';
import { parseUpdateFlagStatus } from '../dtos/flagDto.ts';
import { parseId, parsePagination, queryString, sendError } from '../utils/http.ts';

export class FlagController {
  private flagService: FlagService;

  constructor(flagService: FlagService = new FlagService()) {
    this.flagService = flagService;
  }

  getFlags = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { page, limit } = parsePagination(req.query);
      const { data, total } = await this.flagService.getAllFlags({
        status: queryString(req.query.status),
        page,
        limit,
      });
      return res.status(200).json({ status: 'success', meta: { page, limit, total }, data });
    } catch (error) {
      return sendError(res, error);
    }
  };

  getFlagById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const flag = await this.flagService.getFlagById(parseId(req.params.id, 'ID flag'));
      return res.status(200).json({ status: 'success', data: flag });
    } catch (error) {
      return sendError(res, error);
    }
  };

  updateFlagStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = parseId(req.params.id, 'ID flag');
      const { status } = parseUpdateFlagStatus(req.body);
      const flag = await this.flagService.updateFlagStatus(id, status);
      return res.status(200).json({ status: 'success', data: flag });
    } catch (error) {
      return sendError(res, error);
    }
  };
}
