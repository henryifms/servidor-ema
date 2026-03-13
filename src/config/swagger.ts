import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Estações Metereológicas",
      version: "1.0.0",
      description: "API do sistema EMA",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/app/controllers/*ts"],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  schemas: {
    Usuario: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          example: 1,
        },
        nome: {
          type: "string",
          example: "Henry Thomaz",
        },
        email: {
          type: "string",
          example: "henry@email.com",
        },
      },
    },
  },
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
