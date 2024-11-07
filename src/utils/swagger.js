import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8000/api/",
      },
    ],
    components: {
      schemas: {
        user: {
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string" },
            role: { type: "string" },
          },
        },
      },
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "jwt",
        },
      },
    },

    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: [`./src/routes/*.js`],
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app, port) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
}

export default swaggerDocs;
