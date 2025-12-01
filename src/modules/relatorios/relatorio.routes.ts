import { Router } from "express";
import { RelatorioController } from "./relatorio.controller";
import { authenticateToken } from "../../middleware/authMiddleware";

const relatorioRoutes = Router();
const controller = new RelatorioController();

relatorioRoutes.use(authenticateToken);

/**
 * @swagger
 * /api/v1/relatorios:
 * get:
 * tags: [Relatorios]
 * description: Exporta ocorrências (PDF ou CSV)
 * parameters:
 * - in: query
 * name: format
 * required: true
 * schema:
 * type: string
 * enum: [pdf, csv]
 * - in: query
 * name: status
 * schema:
 * type: string
 */
relatorioRoutes.get("/", controller.export);

export default relatorioRoutes;
