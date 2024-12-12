import express from "express";
import {
  getOrder,
  getOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import authentication from "../middlewares/authentication.middleware.js";
import checkAdminRole from "../middlewares/checkRole.middleware.js";

const orderRouter = express.Router();


/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Retrieve all orders
 *     description: Fetch a paginated list of all orders for the authenticated user.
 *     tags:
 *       - Orders
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of orders to return per page.
 *     responses:
 *       200:
 *         description: Successfully retrieved orders.
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
 *                     orders:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           discount:
 *                             type: number
 *                             example: 0
 *                           discountAmount:
 *                             type: number
 *                             example: 0
 *                           _id:
 *                             type: string
 *                             example: "6752d8e53ed93b90b9e15b4b"
 *                           user:
 *                             type: string
 *                             example: "672880131e56545fdaec6bba"
 *                           items:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 product:
 *                                   $ref: '#/components/schemas/Product'
 *                                 quantity:
 *                                   type: integer
 *                                   example: 5
 *                                 price:
 *                                   type: number
 *                                   example: 100
 *                                 total:
 *                                   type: number
 *                                   example: 500
 *                                 _id:
 *                                   type: string
 *                                   example: "6752d8c83ed93b90b9e15b41"
 *                           totalQuantity:
 *                             type: integer
 *                             example: 7
 *                           currency:
 *                             type: string
 *                             example: "USD"
 *                           totalPrice:
 *                             type: number
 *                             example: 1000
 *                           status:
 *                             type: string
 *                             example: "COMPLETED"
 *                           __v:
 *                             type: integer
 *                             example: 0
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 1
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         totalPages:
 *                           type: integer
 *                           example: 1
 *                 message:
 *                   type: string
 *                   example: "Orders retrieved successfully"
 *       401:
 *         description: Unauthorized. Authentication is required.
 *       500:
 *         description: Internal server error.
 */
orderRouter.get("/", authentication, getOrders); // get all orders

/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Retrieve a specific order
 *     description: Fetch the details of a specific order by its ID for the authenticated user.
 *     tags:
 *       - Orders
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to retrieve.
 *         example: "6752d8e53ed93b90b9e15b4b"
 *     responses:
 *       200:
 *         description: Successfully retrieved the order.
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
 *                     discount:
 *                       type: number
 *                       example: 0
 *                     discountAmount:
 *                       type: number
 *                       example: 0
 *                     _id:
 *                       type: string
 *                       example: "6752d8e53ed93b90b9e15b4b"
 *                     user:
 *                       type: string
 *                       example: "672880131e56545fdaec6bba"
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             $ref: '#/components/schemas/Product'
 *                           quantity:
 *                             type: integer
 *                             example: 5
 *                           price:
 *                             type: number
 *                             example: 100
 *                           total:
 *                             type: number
 *                             example: 500
 *                           _id:
 *                             type: string
 *                             example: "6752d8c83ed93b90b9e15b41"
 *                     totalQuantity:
 *                       type: integer
 *                       example: 7
 *                     currency:
 *                       type: string
 *                       example: "USD"
 *                     totalPrice:
 *                       type: number
 *                       example: 1000
 *                     status:
 *                       type: string
 *                       example: "COMPLETED"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-06T10:58:16.546Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-09T11:18:47.453Z"
 *                     __v:
 *                       type: integer
 *                       example: 0
 *                 message:
 *                   type: string
 *                   example: "Order retrieved successfully!"
 *       400:
 *         description: Bad request. Invalid order ID.
 *       401:
 *         description: Unauthorized. Authentication is required.
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */

orderRouter.get("/:orderId", authentication, getOrder); // get order

/**
 * @swagger
 * /orders/{orderId}:
 *   put:
 *     summary: Update the status of an order
 *     description: Allows an admin user to update the status of a specific order by its ID.
 *     tags:
 *       - Orders
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to update.
 *         example: "6752d8e53ed93b90b9e15b4b"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["PENDING", "COMPLETED", "CANCELLED"]
 *                 description: The new status of the order.
 *                 example: "COMPLETED"
 *     responses:
 *       200:
 *         description: Successfully updated the order status.
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
 *                     _id:
 *                       type: string
 *                       example: "6752d8e53ed93b90b9e15b4b"
 *                     user:
 *                       type: string
 *                       example: "672880131e56545fdaec6bba"
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             $ref: '#/components/schemas/Product'
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *                           price:
 *                             type: number
 *                             example: 100
 *                           total:
 *                             type: number
 *                             example: 200
 *                           _id:
 *                             type: string
 *                             example: "6752d8c83ed93b90b9e15b41"
 *                     totalQuantity:
 *                       type: integer
 *                       example: 2
 *                     totalPrice:
 *                       type: number
 *                       example: 200
 *                     status:
 *                       type: string
 *                       example: "COMPLETED"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-06T10:58:16.546Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-09T11:18:47.453Z"
 *                     __v:
 *                       type: integer
 *                       example: 1
 *                 message:
 *                   type: string
 *                   example: "Order status updated successfully."
 *       400:
 *         description: Bad request. Invalid input.
 *       401:
 *         description: Unauthorized. Authentication is required.
 *       403:
 *         description: Forbidden. Admin privileges are required.
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */

orderRouter.put("/:orderId", authentication, checkAdminRole, updateOrderStatus); //change order status

export default orderRouter;
