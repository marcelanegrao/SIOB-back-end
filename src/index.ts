import "express-async-errors";
import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

import { env } from "./config/environment";
import { errorMiddleware } from "./shared/http/middlewares/errorMiddleware";

import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import ocorrenciaRoutes from "./modules/ocorrencias/ocorrencia.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import relatorioRoutes from "./modules/relatorios/relatorio.routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("API SIOB está online! 🚒");
});

// --- CONFIGURAÇÃO DAS ROTAS DO SWAGGER ---
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/ocorrencias", ocorrenciaRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/relatorios", relatorioRoutes);

app.use(errorMiddleware);

// 5. Inicialização
const PORT = env.port || 3000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`📑 Swagger UI disponível em http://localhost:${PORT}/api-docs`); // Log útil
  });
}

export default app;