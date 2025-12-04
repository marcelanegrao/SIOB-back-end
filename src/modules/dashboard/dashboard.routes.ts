import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { authenticateToken } from "../../shared/http/middlewares/authMiddleware";

const dashboardRoutes = Router();
const controller = new DashboardController();

dashboardRoutes.use(authenticateToken);

/**
 * @openapi
 * tags:
 *   - name: Dashboard
 *     description: Indicadores e KPIs para gráficos
 */

/**
 * @openapi
 * /dashboard:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Retorna KPIs agregados (Por Status, Tipo e Bairro)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Objeto contendo os dados para os gráficos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 porStatus:
 *                   type: object
 *                 porTipo:
 *                   type: array
 *                 porBairro:
 *                   type: array
 */
dashboardRoutes.get("/", controller.getKpis);

export default dashboardRoutes;
