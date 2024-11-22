import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";


const serverUrl =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_SERVER_URL
    : process.env.DEV_SERVER_URL || "http://localhost:8000/api/";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
    },
    servers: [
      {
        url: serverUrl,
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
        Product: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "64aefb1234567890abcd1234",
            },
            name: {
              type: "string",
              example: "Sample Product",
            },
            description: {
              type: "string",
              example: "This is a sample product description.",
            },
            shortDescription: {
              type: "string",
              example: "Short description of the product.",
            },
            price: {
              type: "number",
              format: "float",
              example: 99.99,
            },
            image: {
              type: "object",
              properties: {
                url: {
                  type: "string",
                  example:
                    "http://localhost:9090/images/products/sample-product.jpg",
                },
                localPath: {
                  type: "string",
                  example: "public/images/products/sample-product.jpg",
                },
              },
            },
            category: {
              type: "string",
              example: "electronics",
            },
            subCategory: {
              type: "string",
              example: "mobile phones",
            },
            isFeatured: {
              type: "boolean",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-11-01T12:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-11-15T12:00:00.000Z",
            },
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
