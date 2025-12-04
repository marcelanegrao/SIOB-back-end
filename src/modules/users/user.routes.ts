import { Router } from "express";
import { UserController } from "./user.controller";
import { validate } from "../../shared/http/middlewares/validate";
import { createUserSchema, updateUserSchema } from "./user.validator";
import { authenticateToken } from "../../shared/http/middlewares/authMiddleware";

const userRoutes = Router();
const controller = new UserController();

userRoutes.use(authenticateToken);

/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: Gestão de usuários, patentes e perfis
 */

/**
 * @openapi
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Cria um novo usuário (Requer Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - matricula
 *               - cargo
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               matricula:
 *                 type: string
 *               password:
 *                 type: string
 *               cargo:
 *                 type: string
 *                 example: Soldado
 *               tipo_perfil:
 *                 type: string
 *                 enum:
 *                   - ADMIN
 *                   - ANALISTA
 *                   - CHEFE
 *                   - OPERADOR_CAMPO
 *                 default: ANALISTA
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
userRoutes.post("/", validate(createUserSchema), controller.create);

/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Lista todos os usuários com filtros opcionais
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cargo
 *         schema:
 *           type: string
 *       - in: query
 *         name: status_usuario
 *         schema:
 *           type: string
 *           enum:
 *             - ATIVO
 *             - INATIVO
 *     responses:
 *       200:
 *         description: Lista de usuários retornada
 */
userRoutes.get("/", controller.getAll);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Busca um usuário pelo ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Detalhes do usuário
 *       404:
 *         description: Usuário não encontrado
 */
userRoutes.get("/:id", controller.getById);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Atualiza dados de um usuário
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               cargo:
 *                 type: string
 *               status_usuario:
 *                 type: string
 *                 enum:
 *                   - ATIVO
 *                   - INATIVO
 *     responses:
 *       200:
 *         description: Usuário atualizado
 */
userRoutes.put("/:id", validate(updateUserSchema), controller.update);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Remove um usuário do sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Usuário deletado com sucesso
 */
userRoutes.delete("/:id", controller.delete);

export default userRoutes;