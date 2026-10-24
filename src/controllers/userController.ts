import type { Request, Response } from 'express';
import { UserService } from '../services/userService.ts';
import { isUserRole, parseCreateUser, USER_ROLES } from '../dtos/userDto.ts';
import { AppError, parseId, parsePagination, queryString, sendError } from '../utils/http.ts';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService = new UserService()) {
    this.userService = userService;
  }

  getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { page, limit } = parsePagination(req.query);
      const role = queryString(req.query.role);
      if (role !== undefined && !isUserRole(role)) {
        throw new AppError(400, `Parameter role harus salah satu dari: ${USER_ROLES.join(', ')}`);
      }

      const { data, total } = await this.userService.getAllUsers({ role, page, limit });
      return res.status(200).json({ status: 'success', meta: { page, limit, total }, data });
    } catch (error) {
      return sendError(res, error);
    }
  };

  getUserById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = await this.userService.getUserById(parseId(req.params.id, 'ID user'));
      return res.status(200).json({ status: 'success', data: user });
    } catch (error) {
      return sendError(res, error);
    }
  };

  createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = await this.userService.createUser(parseCreateUser(req.body));
      return res.status(201).json({ status: 'success', data: user });
    } catch (error) {
      return sendError(res, error);
    }
  };
}
