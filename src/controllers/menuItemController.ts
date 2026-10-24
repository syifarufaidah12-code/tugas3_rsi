import type { Request, Response } from 'express';
import { MenuItemService } from '../services/menuItemService.ts';
import { parseCreateMenuItem, parseUpdateMenuItem } from '../dtos/menuItemDto.ts';
import {
  parseId,
  parsePagination,
  queryBool,
  queryId,
  queryString,
  sendError,
} from '../utils/http.ts';

export class MenuItemController {
  private menuItemService: MenuItemService;

  constructor(menuItemService: MenuItemService = new MenuItemService()) {
    this.menuItemService = menuItemService;
  }

  getMenuItems = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { page, limit } = parsePagination(req.query);
      const { data, total } = await this.menuItemService.getAllMenuItems({
        stallId: queryId(req.query.stallId, 'stallId'),
        search: queryString(req.query.search),
        isAvailable: queryBool(req.query.isAvailable, 'isAvailable'),
        page,
        limit,
      });
      return res.status(200).json({ status: 'success', meta: { page, limit, total }, data });
    } catch (error) {
      return sendError(res, error);
    }
  };

  getMenuItemById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const item = await this.menuItemService.getMenuItemById(parseId(req.params.id, 'ID menu'));
      return res.status(200).json({ status: 'success', data: item });
    } catch (error) {
      return sendError(res, error);
    }
  };

  createMenuItem = async (req: Request, res: Response): Promise<Response> => {
    try {
      const item = await this.menuItemService.createMenuItem(parseCreateMenuItem(req.body));
      return res.status(201).json({ status: 'success', data: item });
    } catch (error) {
      return sendError(res, error);
    }
  };

  updateMenuItem = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = parseId(req.params.id, 'ID menu');
      const item = await this.menuItemService.updateMenuItem(id, parseUpdateMenuItem(req.body));
      return res.status(200).json({ status: 'success', data: item });
    } catch (error) {
      return sendError(res, error);
    }
  };

  deleteMenuItem = async (req: Request, res: Response): Promise<Response> => {
    try {
      const item = await this.menuItemService.deleteMenuItem(parseId(req.params.id, 'ID menu'));
      return res.status(200).json({ status: 'success', data: item });
    } catch (error) {
      return sendError(res, error);
    }
  };
}
