import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../shared/http/middlewares/validate";
import { registerSchema, loginSchema } from "./auth.validator";

const authRoutes = Router();
const controller = new AuthController();

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Autenticação de usuários
 */

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Realiza o login do usuário
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 default: admin@bombeiros.pe.gov.br
 *               password:
 *                 type: string
 *                 default: senhaForte123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciais inválidas
 */
authRoutes.post("/login", validate(loginSchema), controller.login);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Registra um novo usuário (Requer token se já houver usuários, ou primeiro acesso)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               matricula:
 *                 type: string
 *               profile:
 *                 type: string
 *                 enum:
 *                   - ADMIN
 *                   - ANALISTA
 *                   - CHEFE
 *                   - OPERADOR_CAMPO
 *     responses:
 *       201:
 *         description: Usuário criado
 */
authRoutes.post("/register", validate(registerSchema), controller.register);

export default authRoutes;
