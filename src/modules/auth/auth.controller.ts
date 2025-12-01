import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body, req.ip);
    return res.status(201).json(result);
  }

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body, req.ip);
    return res.json(result);
  }
}
