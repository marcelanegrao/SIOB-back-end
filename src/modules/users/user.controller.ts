import { Request, Response } from "express";
import { UserService } from "./user.service";

const service = new UserService();

interface AuthRequest extends Request {
  user?: { userId: string; profile: string };
}

export class UserController {
  async create(req: AuthRequest, res: Response) {
    const adminId = req.user?.userId;
    const result = await service.create(req.body, adminId);
    return res.status(201).json(result);
  }

  async getAll(req: Request, res: Response) {
    const result = await service.getAll(req.query);
    return res.json(result);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const result = await service.getById(id);
    return res.json(result);
  }

  async update(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const adminId = req.user?.userId;
    const result = await service.update(id, req.body, adminId);
    return res.json(result);
  }

  async delete(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const adminId = req.user?.userId;
    await service.delete(id, adminId);
    return res.status(204).send();
  }
}
