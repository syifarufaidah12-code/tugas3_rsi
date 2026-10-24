import type { Request, Response } from 'express';
import { StallService } from '../services/stallService.ts';
import { StallReviewService } from '../services/stallReviewService.ts';
import { getValidated } from '../middlewares/validate.ts';
import { getUser } from '../middlewares/auth.ts';
import { sendError } from '../utils/http.ts';

type IdParams = { id: number };
type ListQuery = { search?: string; category?: string; page: number; limit: number };
type StallBody = {
  name: string;
  category?: string;
  location?: string;
  description?: string;
};
type ReviewBody = { rating: number; comment?: string };

export class StallController {
  private stallService: StallService;
  private reviewService: StallReviewService;

  constructor(
    stallService: StallService = new StallService(),
    reviewService: StallReviewService = new StallReviewService(),
  ) {
    this.stallService = stallService;
    this.reviewService = reviewService;
  }

  getStalls = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const { search, category, page, limit } = getValidated<ListQuery>(res, 'query');
      const { data, total } = await this.stallService.getAllStalls({
        search,
        category,
        page,
        limit,
      });
      return res.status(200).json({ status: 'success', meta: { page, limit, total }, data });
    } catch (error) {
      return sendError(res, error);
    }
  };

  getStallById = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = getValidated<IdParams>(res, 'params');
      const stall = await this.stallService.getStallById(id);
      return res.status(200).json({ status: 'success', data: stall });
    } catch (error) {
      return sendError(res, error);
    }
  };

  getStallMenus = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = getValidated<IdParams>(res, 'params');
      const menus = await this.stallService.getStallMenus(id);
      return res.status(200).json({ status: 'success', data: menus });
    } catch (error) {
      return sendError(res, error);
    }
  };

  createStall = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const body = getValidated<StallBody>(res, 'body');
      const stall = await this.stallService.createStall(body, getUser(res));
      return res.status(201).json({ status: 'success', data: stall });
    } catch (error) {
      return sendError(res, error);
    }
  };

  updateStall = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = getValidated<IdParams>(res, 'params');
      const body = getValidated<Partial<StallBody>>(res, 'body');
      const stall = await this.stallService.updateStall(id, body, getUser(res));
      return res.status(200).json({ status: 'success', data: stall });
    } catch (error) {
      return sendError(res, error);
    }
  };

  deleteStall = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = getValidated<IdParams>(res, 'params');
      const stall = await this.stallService.deleteStall(id);
      return res.status(200).json({ status: 'success', data: stall });
    } catch (error) {
      return sendError(res, error);
    }
  };

  createReview = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = getValidated<IdParams>(res, 'params');
      const body = getValidated<ReviewBody>(res, 'body');
      const review = await this.reviewService.createForStall(id, getUser(res).id, body);
      return res.status(201).json({ status: 'success', data: review });
    } catch (error) {
      return sendError(res, error);
    }
  };
}