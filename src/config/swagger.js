import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const serverUrl =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_SERVER_URL
    : process.env.DEV_SERVER_URL || "http://localhost:8000";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
    },
    servers: [
      {
        url: `${serverUrl}/api`,
      },
    ],
    tags: [
      {
        name: "User Authentication",
        description: "Endpoints related to authentication",
      },
      {
        name: "User Profile",
        description: "User profile management endpoints",
      },
      { name: "Products", description: "Product management endpoints" },
      { name: "Cart", description: "Cart management endpoints" },
      {
        name: "Categories",
        description: "Endpoints for managing product categories",
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
            currency: {
              type: "string",
            },
            image: {
              type: "object",
              properties: {
                url: {
                  type: "string",
                  example:
                    "http://localhost:9090/images/products/sample-product.jpg",
                },
                assetId: {
                  type: "string",
                  example: "e5122ad8bcfa9c1bfb7f3a691757ab84",
                },
                publicId: {
                  type: "string",
                  example: "bg_products-1733901258575_btozo5",
                },
                _id: {
                  type: "string",
                  example: "67593bcc16c4c3d7d13ea0a7",
                },
              },
            },
            categories: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["electronics"],
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
        coupon: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "645dcb6b5e7f1b3b3b9e4bfc",
            },
            code: {
              type: "string",
              example: "SUMMER2024",
            },
            discount: {
              type: "number",
              example: 20,
            },
            maxDiscount: {
              type: "number",
              example: 100,
            },
            expiry: {
              type: "string",
              format: "date",
              example: "2024-12-31",
            },
            isActive: {
              type: "boolean",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-12-06T10:58:16.546Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-12-06T10:58:16.546Z",
            },
          },
        },
        category: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "The name of the category.",
              example: "fashions",
            },
            products: {
              type: "array",
              description: "List of products under this category.",
              items: {
                type: "object",
                description: "Product details (if available).",
              },
              example: [],
            },
            _id: {
              type: "string",
              description: "The unique identifier for the category.",
              example: "675ac705057fccb488587916",
            },
            __v: {
              type: "integer",
              description: "Version key maintained by MongoDB.",
              example: 0,
            },
          },
        },
      },
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
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
  console.log(`Swagger docs available`);
}

export default swaggerDocs;
