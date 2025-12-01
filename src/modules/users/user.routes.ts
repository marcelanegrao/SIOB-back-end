import { Router } from "express";
const userRoutes = Router();
userRoutes.get("/", (req, res) => res.json({ message: "Módulo Users" }));
export default userRoutes;
