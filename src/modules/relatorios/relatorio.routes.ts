import { Router } from "express";
import { RelatorioController } from "./relatorio.controller";
import { authenticateToken } from "../../shared/http/middlewares/authMiddleware";

const relatorioRoutes = Router();
const controller = new RelatorioController();

relatorioRoutes.use(authenticateToken);

/**
 * @openapi
 * tags:
 *   - name: Relatorios
 *     description: Exportação de dados
 */

/**
 * @openapi
 * /relatorios:
 *   get:
 *     tags:
 *       - Relatorios
 *     summary: Baixa relatório em PDF ou CSV
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - pdf
 *             - csv
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Arquivo binário (PDF ou CSV)
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *           text/csv:
 *             schema:
 *               type: string
 */
relatorioRoutes.get("/", controller.export);

export default relatorioRoutes;
