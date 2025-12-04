import { Router } from "express";
import { OcorrenciaController } from "./ocorrencia.controller";
import { validate } from "../../shared/http/middlewares/validate";
import { createOcorrenciaSchema, updateOcorrenciaSchema } from "./ocorrencia.validator";
import { authenticateToken } from "../../shared/http/middlewares/authMiddleware";
import { uploadMiddleware } from "../../shared/http/middlewares/uploadMiddleware";

const ocorrenciaRoutes = Router();
const controller = new OcorrenciaController();

ocorrenciaRoutes.use(authenticateToken);

/**
 * @openapi
 * tags:
 *   - name: Ocorrencias
 *     description: Gestão completa de ocorrências operacionais
 */

/**
 * @openapi
 * /ocorrencias:
 *   post:
 *     tags:
 *       - Ocorrencias
 *     summary: Cria uma nova ocorrência
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bairro
 *               - tipo
 *               - data_acionamento
 *               - hora_acionamento
 *             properties:
 *               tipo:
 *                 type: string
 *                 example: Incêndio
 *               bairro:
 *                 type: string
 *                 example: Boa Viagem
 *               prioridade:
 *                 type: string
 *                 enum:
 *                   - ALTA
 *                   - MEDIA
 *                   - BAIXA
 *               status:
 *                 type: string
 *                 enum:
 *                   - PENDENTE
 *                   - EM_ANDAMENTO
 *                   - CONCLUIDA
 *               data_acionamento:
 *                 type: string
 *                 format: date-time
 *               hora_acionamento:
 *                 type: string
 *                 format: date-time
 *               historico_texto:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ocorrência criada com sucesso
 */
ocorrenciaRoutes.post("/", validate(createOcorrenciaSchema), controller.create);

/**
 * @openapi
 * /ocorrencias:
 *   get:
 *     tags:
 *       - Ocorrencias
 *     summary: Lista ocorrências com filtros avançados
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: bairro
 *         schema:
 *           type: string
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
ocorrenciaRoutes.get("/", controller.getAll);

/**
 * @openapi
 * /ocorrencias/{id}:
 *   get:
 *     tags:
 *       - Ocorrencias
 *     summary: Obtém detalhes completos de uma ocorrência (incluindo mídias e vítimas)
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
 *         description: Detalhes da ocorrência
 */
ocorrenciaRoutes.get("/:id", controller.getById);

/**
 * @openapi
 * /ocorrencias/{id}:
 *   put:
 *     tags:
 *       - Ocorrencias
 *     summary: Atualiza dados da ocorrência (Status, Histórico, etc)
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
 *               status:
 *                 type: string
 *               historico_texto:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ocorrência atualizada
 */
ocorrenciaRoutes.put("/:id", validate(updateOcorrenciaSchema), controller.update);

/**
 * @openapi
 * /ocorrencias/{id}:
 *   delete:
 *     tags:
 *       - Ocorrencias
 *     summary: Exclui uma ocorrência
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
 *         description: Ocorrência removida
 */
ocorrenciaRoutes.delete("/:id", controller.delete);

/**
 * @openapi
 * /ocorrencias/{id}/midias:
 *   post:
 *     tags:
 *       - Ocorrencias
 *     summary: Upload de fotos ou PDFs para a ocorrência (Cloudinary)
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Upload realizado e vinculado com sucesso
 */
ocorrenciaRoutes.post("/:id/midias", uploadMiddleware.single("file"), controller.uploadMidia);

export default ocorrenciaRoutes;
