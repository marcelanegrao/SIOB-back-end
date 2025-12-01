import { Router } from "express";
import { UserController } from "./user.controller";
import { validate } from "../../shared/http/middlewares/validate";
import { createUserSchema, updateUserSchema } from "./user.validator";
import { authenticateToken } from "../../middleware/authMiddleware";

const userRoutes = Router();
const controller = new UserController();

// Protege todas as rotas de usuário (Apenas logados)
userRoutes.use(authenticateToken);

/**
 * @swagger
 * tags:
 * name: Users
 * description: Gestão de usuários (Bombeiros)
 */

userRoutes.post("/", validate(createUserSchema), controller.create);
userRoutes.get("/", controller.getAll);
userRoutes.get("/:id", controller.getById);
userRoutes.put("/:id", validate(updateUserSchema), controller.update);
userRoutes.delete("/:id", controller.delete);

export default userRoutes;
