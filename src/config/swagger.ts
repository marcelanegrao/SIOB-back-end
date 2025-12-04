import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./environment";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SIOB API - Documentação",
      version: "1.0.0",
      description: "API do Sistema Integrado de Operações de Bombeiros (SIOB).",
      contact: {
        name: "Suporte SIOB",
      },
    },
    servers: [
      {
        url: `http://localhost:${env.port}/api/v1`,
        description: "Servidor de Desenvolvimento",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/modules/**/*.ts", "./src/shared/http/routes/*.ts"], 
};

export const swaggerSpec = swaggerJsdoc(options);