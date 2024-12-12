import express from "express";
import authentication from "../middlewares/authentication.middleware.js";
import {
  addOrUpdateToCart,
  checkoutCart,
  emptyCart,
  getCart,
  removeItemFromCart,
} from "../controllers/cart.controller.js";

const cartRouter = express.Router();

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add items to the cart
 *     description: Adds a product to the user's cart with a specified quantity.
 *     tags:
 *       - Cart
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product to add to the cart.
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the product to add.
 *     responses:
 *       200:
 *         description: Successfully updated the cart.
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
 *                       example: "6752d8c83ed93b90b9e15b40"
 *                     user:
 *                       type: string
 *                       example: "672880131e56545fdaec6bba"
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: string
 *                             example: "673dba3f9866911703069aed"
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *                           price:
 *                             type: number
 *                             example: 250
 *                           total:
 *                             type: number
 *                             example: 500
 *                           _id:
 *                             type: string
 *                             example: "6756c6782700afa0147e5693"
 *                     status:
 *                       type: string
 *                       example: "ACTIVE"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-06T10:58:16.546Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-09T10:29:12.789Z"
 *                     totalQuantity:
 *                       type: integer
 *                       example: 2
 *                     totalPrice:
 *                       type: number
 *                       example: 500
 *                     __v:
 *                       type: integer
 *                       example: 3
 *                 message:
 *                   type: string
 *                   example: "Cart updated successfully"
 *       400:
 *         description: Bad request. Invalid input or missing parameters.
 *       401:
 *         description: Unauthorized. Authentication is required.
 *       500:
 *         description: Internal server error.
 */

cartRouter.post("/add", authentication, addOrUpdateToCart);

/**
 * @swagger
 * /cart/update:
 *   put:
 *     summary: Update the quantity of a product in the cart
 *     description: Updates the quantity of a specific product in the user's cart.
 *     tags:
 *       - Cart
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product to update in the cart.
 *                 example: "673dba3f9866911703069aed"
 *               quantity:
 *                 type: integer
 *                 description: The updated quantity for the product.
 *                 example: 2
 *     responses:
 *       200:
 *         description: Successfully updated the cart.
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
 *                       example: "6752d8c83ed93b90b9e15b40"
 *                     user:
 *                       type: string
 *                       example: "672880131e56545fdaec6bba"
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: string
 *                             example: "673dba3f9866911703069aed"
 *                           quantity:
 *                             type: integer
 *                             example: 6
 *                           price:
 *                             type: number
 *                             example: 250
 *                           total:
 *                             type: number
 *                             example: 1500
 *                           _id:
 *                             type: string
 *                             example: "6756c6782700afa0147e5693"
 *                     status:
 *                       type: string
 *                       example: "ACTIVE"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-06T10:58:16.546Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-09T10:53:29.930Z"
 *                     totalQuantity:
 *                       type: integer
 *                       example: 6
 *                     totalPrice:
 *                       type: number
 *                       example: 1500
 *                     __v:
 *                       type: integer
 *                       example: 3
 *                 message:
 *                   type: string
 *                   example: "Cart updated successfully"
 *       400:
 *         description: Bad request. Invalid input or missing parameters.
 *       401:
 *         description: Unauthorized. Authentication is required.
 *       404:
 *         description: Product or cart not found.
 *       500:
 *         description: Internal server error.
 */

cartRouter.put("/update", authentication, addOrUpdateToCart);

/**
 * @swagger
 * /cart/remove:
 *   post:
 *     summary: Remove an item from the cart
 *     description: Removes a specific product from the user's cart.
 *     tags:
 *       - Cart
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product to be removed from the cart.
 *                 example: "673dc148df701eafb549461e"
 *     responses:
 *       200:
 *         description: Successfully removed the product from the cart.
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
 *                       example: "6752d8c83ed93b90b9e15b40"
 *                     user:
 *                       type: string
 *                       example: "672880131e56545fdaec6bba"
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                     status:
 *                       type: string
 *                       example: "ACTIVE"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-06T10:58:16.546Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-09T11:18:47.453Z"
 *                     totalQuantity:
 *                       type: integer
 *                       example: 0
 *                     totalPrice:
 *                       type: number
 *                       example: 0
 *                     __v:
 *                       type: integer
 *                       example: 4
 *                 message:
 *                   type: string
 *                   example: "Product removed from cart successfully"
 *       400:
 *         description: Bad request. Invalid input or missing parameters.
 *       401:
 *         description: Unauthorized. Authentication is required.
 *       404:
 *         description: Product not found in the cart or cart does not exist.
 *       500:
 *         description: Internal server error.
 */

cartRouter.post("/remove", authentication, removeItemFromCart);

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Retrieve the user's cart
 *     description: Fetch the current state of the user's cart, including all items, quantities, and totals.
 *     tags:
 *       - Cart
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the cart.
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
 *                       example: "6752d8c83ed93b90b9e15b40"
 *                     user:
 *                       type: string
 *                       example: "672880131e56545fdaec6bba"
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: string
 *                             example: "673dba3f9866911703069aed"
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *                           price:
 *                             type: number
 *                             example: 250
 *                           total:
 *                             type: number
 *                             example: 500
 *                           _id:
 *                             type: string
 *                             example: "6756c6782700afa0147e5693"
 *                     status:
 *                       type: string
 *                       example: "CHECKOUT"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-06T10:58:16.546Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-09T10:29:12.789Z"
 *                     totalQuantity:
 *                       type: integer
 *                       example: 2
 *                     totalPrice:
 *                       type: number
 *                       example: 500
 *                     __v:
 *                       type: integer
 *                       example: 3
 *                 message:
 *                   type: string
 *                   example: "Cart retrieved successfully"
 *       401:
 *         description: Unauthorized. Authentication is required.
 *       404:
 *         description: Cart not found.
 *       500:
 *         description: Internal server error.
 */

cartRouter.get("/", authentication, getCart);

/**
 * @swagger
 * /cart/checkout:
 *   put:
 *     summary: Checkout the cart
 *     description: Processes the cart for checkout, optionally applying a coupon, and creates an order.
 *     tags:
 *       - Cart
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               couponCode:
 *                 type: string
 *                 description: Optional coupon code to apply for the checkout.
 *                 example: "NEW20"
 *     responses:
 *       200:
 *         description: Checkout successful and order created.
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
 *                     orderId:
 *                       type: string
 *                       description: The ID of the created order.
 *                       example: "6752d8e53ed93b90b9e15b4b"
 *                     totalPrice:
 *                       type: number
 *                       description: The total price of the order after applying discounts.
 *                       example: 800
 *                     currency:
 *                       type: string
 *                       description: The currency used for the order.
 *                       example: "USD"
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                             description: ID of the product.
 *                             example: "673dba3f9866911703069aed"
 *                           quantity:
 *                             type: number
 *                             description: Quantity of the product.
 *                             example: 2
 *                           price:
 *                             type: number
 *                             description: Price of a single product.
 *                             example: 250
 *                           total:
 *                             type: number
 *                             description: Total price for the product (quantity * price).
 *                             example: 500
 *                 message:
 *                   type: string
 *                   example: "Checkout successful, order created"
 *       400:
 *         description: Bad request. Cart is empty, invalid coupon, or invalid data.
 *       401:
 *         description: Unauthorized. Authentication is required.
 *       500:
 *         description: Internal server error.
 */

cartRouter.put("/checkout", authentication, checkoutCart);

/**
 * @swagger
 * /cart/empty:
 *   patch:
 *     summary: Empty the cart
 *     description: Removes all items from the user's cart.
 *     tags:
 *       - Cart
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Cart emptied successfully.
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
 *                   example: "Cart emptied successfully"
 *       401:
 *         description: Unauthorized. Authentication is required.
 *       500:
 *         description: Internal server error.
 */

cartRouter.patch("/empty", authentication, emptyCart);

export default cartRouter;
