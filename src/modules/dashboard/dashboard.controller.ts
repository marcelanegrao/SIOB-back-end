import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";

const service = new DashboardService();

export class DashboardController {
  async getKpis(req: Request, res: Response) {
    // Executa todas as queries em paralelo para ser mais rápido
    const [porStatus, porTipo, porBairro] = await Promise.all([
      service.getOcorrenciasPorStatus(req.query),
      service.getOcorrenciasPorTipo(req.query),
      service.getOcorrenciasPorBairro(req.query),
    ]);

    return res.json({
      porStatus,
      porTipo,
      porBairro
    });
  }
}
