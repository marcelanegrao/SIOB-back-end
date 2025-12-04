import { Request, Response } from "express";
import { OcorrenciaService } from "./ocorrencia.service";

const service = new OcorrenciaService();

interface AuthRequest extends Request {
  user?: { userId: string; profile: string };
}

export class OcorrenciaController {
  async create(req: AuthRequest, res: Response) {
    const userId = req.user?.userId; 
    if (!userId) return res.status(401).json({ error: "Usuário não identificado" });
    const result = await service.create(req.body, userId);
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

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const result = await service.update(id, req.body);
    return res.json(result);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await service.delete(id);
    return res.status(204).send();
  }

  // --- NOVO MÉTODO PARA UPLOAD ---
  async uploadMidia(req: AuthRequest, res: Response) {
    const { id } = req.params; // ID da Ocorrência
    const userId = req.user?.userId;
    const file = req.file; // Arquivo vindo do Multer

    if (!userId) return res.status(401).json({ error: "Usuário não autenticado." });
    if (!file) return res.status(400).json({ error: "Nenhum arquivo enviado." });

    // Chama o service passando a URL gerada pelo Cloudinary
    const result = await service.addMidia(id, userId, {
      url: file.path, // O Cloudinary retorna a URL na propriedade 'path'
      tipo: file.mimetype
    });

    return res.status(201).json(result);
  }
}