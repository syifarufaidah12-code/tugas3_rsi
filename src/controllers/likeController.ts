import type { Request, Response } from 'express';
import { LikeService } from '../services/likeService.ts';
import { parseCreateLike } from '../dtos/likeDto.ts';
import { parseId, sendError } from '../utils/http.ts';

export class LikeController {
  private likeService: LikeService;

  constructor(likeService: LikeService = new LikeService()) {
    this.likeService = likeService;
  }

  createLike = async (req: Request, res: Response): Promise<Response> => {
    try {
      const like = await this.likeService.createLike(parseCreateLike(req.body));
      return res.status(201).json({ status: 'success', data: like });
    } catch (error) {
      return sendError(res, error);
    }
  };

  deleteLike = async (req: Request, res: Response): Promise<Response> => {
    try {
      const like = await this.likeService.deleteLike(parseId(req.params.id, 'ID like'));
      return res.status(200).json({ status: 'success', data: like });
    } catch (error) {
      return sendError(res, error);
    }
  };
}
