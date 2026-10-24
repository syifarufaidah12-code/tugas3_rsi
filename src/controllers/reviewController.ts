import type { Request, Response } from 'express';
import { ReviewService } from '../services/reviewService.ts';
import { parseCreateReview } from '../dtos/reviewDto.ts';
import { parseId, parsePagination, queryId, sendError } from '../utils/http.ts';

export class ReviewController {
  private reviewService: ReviewService;

  constructor(reviewService: ReviewService = new ReviewService()) {
    this.reviewService = reviewService;
  }

  getReviews = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { page, limit } = parsePagination(req.query);
      const { data, total } = await this.reviewService.getAllReviews({
        stallId: queryId(req.query.stallId, 'stallId'),
        userId: queryId(req.query.userId, 'userId'),
        page,
        limit,
      });
      return res.status(200).json({ status: 'success', meta: { page, limit, total }, data });
    } catch (error) {
      return sendError(res, error);
    }
  };

  getReviewById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const review = await this.reviewService.getReviewById(parseId(req.params.id, 'ID review'));
      return res.status(200).json({ status: 'success', data: review });
    } catch (error) {
      return sendError(res, error);
    }
  };

  createReview = async (req: Request, res: Response): Promise<Response> => {
    try {
      const review = await this.reviewService.createReview(parseCreateReview(req.body));
      return res.status(201).json({ status: 'success', data: review });
    } catch (error) {
      return sendError(res, error);
    }
  };

  deleteReview = async (req: Request, res: Response): Promise<Response> => {
    try {
      const review = await this.reviewService.deleteReview(parseId(req.params.id, 'ID review'));
      return res.status(200).json({ status: 'success', data: review });
    } catch (error) {
      return sendError(res, error);
    }
  };
}
