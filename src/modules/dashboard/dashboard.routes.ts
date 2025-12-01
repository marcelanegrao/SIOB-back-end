import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { authenticateToken } from "../../middleware/authMiddleware";

const dashboardRoutes = Router();
const controller = new DashboardController();

dashboardRoutes.use(authenticateToken);

/**
 * @swagger
 * /api/v1/dashboard:
 * get:
 * tags: [Dashboard]
 * description: Retorna todos os KPIs (Status, Tipo, Bairro)
 * parameters:
 * - in: query
 * name: dataInicio
 * schema:
 * type: string
 * format: date-time
 * - in: query
 * name: dataFim
 * schema:
 * type: string
 * format: date-time
 */
dashboardRoutes.get("/", controller.getKpis);

export default dashboardRoutes;
