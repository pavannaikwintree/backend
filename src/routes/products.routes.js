import express from "express";
import upload from "../middlewares/fileUpload.middleware.js";
import {
  createProduct,
  deleteProduct,
  deleteProducts,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import authentication from "../middlewares/authentication.middleware.js";

const productRouter = express.Router();

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get a product by its ID
 *     description: Retrieve a single product by its unique identifier.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique identifier of the product to retrieve.
 *         schema:
 *           type: string
 *           example: 64aefb1234567890abcd1234
 *     responses:
 *       200:
 *         description: Product retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *                 message:
 *                   type: string
 *                   example: "Product retrieved successfully!"
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
productRouter.get("/:id", getProductById); // single product

/**
 * @swagger
 * paths:
 *   /products:
 *     get:
 *       tags:
 *         - Products
 *       summary: Retrieve a list of products
 *       description: Fetches all products with optional query parameters for pagination and filtering.
 *       parameters:
 *         - name: page
 *           in: query
 *           description: The page number for pagination.
 *           required: false
 *           schema:
 *             type: integer
 *             example: 1
 *         - name: limit
 *           in: query
 *           description: The number of items to return per page.
 *           required: false
 *           schema:
 *             type: integer
 *             example: 10
 *         - name: category
 *           in: query
 *           description: Filter products by category.
 *           required: false
 *           schema:
 *             type: string
 *             example: electronics
 *         - name: isFeatured
 *           in: query
 *           description: Filter featured products.
 *           required: false
 *           schema:
 *             type: boolean
 *             example: true
 *       responses:
 *         200:
 *           description: A list of products
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: true
 *                   data:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Product'
 *                   message:
 *                     type: string
 *                     example: Products retrieved successfully.
 *         400:
 *           description: Bad Request
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: false
 *                   message:
 *                     type: string
 *                     example: Invalid request parameters.
 *         500:
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: false
 *                   message:
 *                     type: string
 *                     example: An error occurred while fetching products.
 */

productRouter.get("/", getProducts); // get all products

/**
 * @swagger
 * paths:
 *   /products:
 *     post:
 *       tags:
 *         - Products
 *       summary: Create a new product
 *       description: Adds a new product to the database with the provided details.
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: Sample Product
 *                 description:
 *                   type: string
 *                   example: This is a sample product description.
 *                 shortDescription:
 *                   type: string
 *                   example: Short description of the product.
 *                 price:
 *                   type: number
 *                   format: float
 *                   example: 99.99
 *                 currency:
 *                   type: string
 *                   example: USD
 *                 categories:
 *                   type: array
 *                   items:
 *                      type: string
 *                   example: [electronics, mobiles]
 *                 isFeatured:
 *                   type: boolean
 *                   example: true
 *                 image:
 *                   type: string
 *                   format: binary
 *       responses:
 *         201:
 *           description: Product created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: true
 *                   data:
 *                     $ref: '#/components/schemas/Product'
 *                   message:
 *                     type: string
 *                     example: Product created successfully!
 *         400:
 *           description: Bad Request
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: false
 *                   message:
 *                     type: string
 *                     example: Invalid input data.
 *         500:
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: false
 *                   message:
 *                     type: string
 *                     example: An error occurred while creating the product.
 */

productRouter.post("/", authentication, upload.single("image"), createProduct); // create product

/**
 * @swagger
 * paths:
 *   /products/update/{id}:
 *     put:
 *       tags:
 *         - Products
 *       summary: Update an existing product
 *       description: Updates the details of an existing product by its ID.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: The ID of the product to update
 *           required: true
 *           schema:
 *             type: string
 *             example: 64aefb1234567890abcd1234
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: Sample Product
 *                 description:
 *                   type: string
 *                   example: This is a sample product description.
 *                 shortDescription:
 *                   type: string
 *                   example: Short description of the product.
 *                 price:
 *                   type: number
 *                   format: float
 *                   example: 99.99
 *                 currency:
 *                   type: string
 *                   example: USD
 *                 categories:
 *                   type: array
 *                   items:
 *                      type: string
 *                   example: [electronics, mobiles]
 *                 isFeatured:
 *                   type: boolean
 *                   example: true
 *                 image:
 *                   type: string
 *                   format: binary
 *       responses:
 *         200:
 *           description: Product updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: true
 *                   data:
 *                     $ref: '#/components/schemas/Product'
 *                   message:
 *                     type: string
 *                     example: Product updated successfully!
 *         400:
 *           description: Bad Request
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: false
 *                   message:
 *                     type: string
 *                     example: Invalid input data.
 *         404:
 *           description: Product not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: false
 *                   message:
 *                     type: string
 *                     example: Product not found.
 *         500:
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: false
 *                   message:
 *                     type: string
 *                     example: An error occurred while updating the product.
 */

productRouter.put(
  "/update/:id",
  authentication,
  upload.single("image"),
  updateProduct
); // update product

/**
 * @swagger
 * paths:
 *   /products/{id}:
 *     delete:
 *       tags:
 *         - Products
 *       summary: Delete an existing product
 *       description: Deletes a product by its ID from the database.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: The ID of the product to delete
 *           required: true
 *           schema:
 *             type: string
 *             example: 64aefb1234567890abcd1234
 *       responses:
 *         200:
 *           description: Product deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: true
 *                   data:
 *                     $ref: '#/components/schemas/Product'
 *                   message:
 *                     type: string
 *                     example: Product deleted successfully!
 *         404:
 *           description: Product not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: false
 *                   message:
 *                     type: string
 *                     example: Product not found.
 *         500:
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: false
 *                   message:
 *                     type: string
 *                     example: An error occurred while deleting the product.
 */

productRouter.delete("/:id", authentication, deleteProduct);

/**
 * @swagger
 * /products:
 *   delete:
 *     summary: Delete products
 *     description: Allows an authenticated user to delete multiple products. The IDs of the products to be deleted should be passed in the request body.
 *     tags:
 *       - Products
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of product IDs to delete.
 *                 example: ["673dba3f9866911703069aed", "67471d3d247f4edbe8d41dda"]
 *     responses:
 *       200:
 *         description: Products deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Products deleted successfully."
 *       400:
 *         description: Bad request. Invalid product IDs or missing required fields.
 *       401:
 *         description: Unauthorized. Authentication is required.
 *       403:
 *         description: Forbidden. Insufficient permissions to delete products.
 *       500:
 *         description: Internal server error.
 */
productRouter.delete("/", authentication, deleteProducts);

export default productRouter;
