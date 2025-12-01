import "express-async-errors";
import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import { env } from "./config/environment";
import { errorMiddleware } from "./shared/http/middlewares/errorMiddleware";
import swaggerSpec from "./config/swaggerConfig";

// Rotas
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import ocorrenciaRoutes from "./modules/ocorrencias/ocorrencia.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import relatorioRoutes from "./modules/relatorios/relatorio.routes";

const app = express();

// 1. Middlewares Globais
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// 2. Documentação (Swagger)
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs-json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// 3. Rota Raiz (Health Check)
app.get("/", (req, res) => {
  res.send("API SIOB está online! 🚒");
});

// 4. Rotas da Aplicação
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/ocorrencias", ocorrenciaRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);  // <--- NOVO
app.use("/api/v1/relatorios", relatorioRoutes); // <--- NOVO

// 5. Tratamento de Erros (Sempre o último)
app.use(errorMiddleware);

// 6. Inicialização
const PORT = env.port || 3000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📄 Swagger disponível em http://localhost:${PORT}/api/docs`);
  });
}

export default app;
