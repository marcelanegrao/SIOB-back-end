import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API SIOB",
      version: "1.0.0",
      description: "Documentação da API Modular do SIOB",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./src/modules/**/*.routes.ts"],
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
