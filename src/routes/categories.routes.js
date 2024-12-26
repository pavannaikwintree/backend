import express from "express";
import {
  addCategory,
  deleteCategories,
  deleteCategory,
  getAllCategories,
  getCategory,
} from "../controllers/categories.controller.js";
import authentication from "../middlewares/authentication.middleware.js";
import checkAdminRole from "../middlewares/checkRole.middleware.js";

const categoryRouter = express.Router();

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Add a new category
 *     description: Allows an admin to create a new category in the system.
 *     tags:
 *       - Categories
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category.
 *                 example: "Electronics"
 *
 *     responses:
 *       201:
 *         description: Category created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: "#/components/schemas/category"
 *                 message:
 *                   type: string
 *                   example: "Category added successfully"
 *       400:
 *         description: Bad request. Invalid input or missing required fields.
 *       401:
 *         description: Unauthorized. Authentication is required.
 *       403:
 *         description: Forbidden. Admin privileges are required.
 *       500:
 *         description: Internal server error.
 */

categoryRouter.post("/", authentication, checkAdminRole, addCategory);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve all categories
 *     description: Fetches a list of all categories available in the system.
 *     tags:
 *       - Categories
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: A list of categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   description: List of categories.
 *                   items:
 *                     $ref: "#/components/schemas/category"
 *                 message:
 *                   type: string
 *                   example: "Categories retrieved successfully"
 *       401:
 *         description: Unauthorized. Authentication is required.
 *       500:
 *         description: Internal server error.
 */

categoryRouter.get("/", authentication, getAllCategories);

/**
 * @swagger
 * /categories/{categoryName}:
 *   get:
 *     summary: Retrieve a specific category
 *     description: Fetches details of a category by its name.
 *     tags:
 *       - Categories
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryName
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the category to retrieve.
 *     responses:
 *       200:
 *         description: Details of the specified category.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: "#/components/schemas/category"
 *                 message:
 *                   type: string
 *                   example: "Category retrieved successfully"
 *       401:
 *         description: Unauthorized. Authentication is required.
 *       404:
 *         description: Category not found.
 *       500:
 *         description: Internal server error.
 */

categoryRouter.get("/:categoryName", authentication, getCategory);


/**
 * @swagger
 * paths:
 *   /categories:
 *     delete:
 *       tags:
 *         - Categories
 *       summary: Delete multiple categories
 *       description: Deletes all specified categories from the database. Requires admin privileges.
 *       security:
 *         - cookieAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categoryIds:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Array of category IDs to delete
 *                   example: ["675807d7a16dfcb3ffd01d01", "675807d7a16dfcb3ffd01d02"]
 *       responses:
 *         200:
 *           description: Categories deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: true
 *                   message:
 *                     type: string
 *                     example: 8 categories deleted
 *         400:
 *           description: Bad request. Invalid or missing category IDs.
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
 *                     example: Invalid category IDs provided.
 *         401:
 *           description: Unauthorized. Authentication is required.
 *         403:
 *           description: Forbidden. Admin privileges are required.
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
 *                     example: An error occurred while deleting the categories.
 */

categoryRouter.delete("/", authentication, checkAdminRole, deleteCategories);

/**
 * @swagger
 * /categories/{categoryId}:
 *   delete:
 *     summary: Delete a specific category
 *     description: Allows an admin to delete a category by its ID
 *     tags:
 *       - Categories
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *         description: The name or ID of the category to delete.
 *     responses:
 *       200:
 *         description: Category deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: null
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Category deleted successfully"
 *       401:
 *         description: Unauthorized. Authentication is required.
 *       403:
 *         description: Forbidden. Admin privileges are required.
 *       404:
 *         description: Category not found.
 *       500:
 *         description: Internal server error.
*/

categoryRouter.delete(
  "/:categoryId",
  authentication,
  checkAdminRole,
  deleteCategory
);


export default categoryRouter;
