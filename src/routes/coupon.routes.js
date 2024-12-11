import express from "express";
import {
  createNewCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCoupons,
  getCoupon,
} from "../controllers/coupon.controller.js";
import checkAdminRole from "../middlewares/checkRole.middleware.js";
import authentication from "../middlewares/authentication.middleware.js";

const couponRouter = express.Router();

/**
 * @swagger
 * /coupons:
 *   post:
 *     summary: Create a new coupon
 *     description: Allows an admin user to create a new coupon for the store.
 *     tags:
 *       - Coupons
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: The unique code for the coupon.
 *                 example: "SUMMER2024"
 *               discount:
 *                 type: number
 *                 description: The discount percentage offered by the coupon.
 *                 example: 20
 *               maxDiscount:
 *                 type: number
 *                 description: The max discount offered by the coupon.
 *                 example: 100
 *               expiry:
 *                 type: string
 *                 format: date
 *                 description: The expiration date of the coupon.
 *                 example: "2024-12-31"
 *               isActive:
 *                 type: boolean
 *                 description: The status of the coupon.
 *                 example: true
 *     responses:
 *       201:
 *         description: Coupon created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/coupon'
 *                 message:
 *                   type: string
 *                   example: "Coupon created successfully"
 *       400:
 *         description: Bad request. Invalid input or missing required fields.
 *       401:
 *         description: Unauthorized. Authentication is required.
 *       403:
 *         description: Forbidden. Admin privileges are required.
 *       500:
 *         description: Internal server error.
 */
couponRouter.post("/", authentication, checkAdminRole, createNewCoupon);


/**
 * @swagger
 * /coupons/{couponId}:
 *   put:
 *     summary: Update an existing coupon
 *     description: Allows an admin user to update an existing coupon by its ID.
 *     tags:
 *       - Coupons
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: couponId
 *         required: true
 *         description: The ID of the coupon to be updated.
 *         schema:
 *           type: string
 *           example: "645dcb6b5e7f1b3b3b9e4bfc"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: The unique code for the coupon.
 *                 example: "SUMMER2024"
 *               discount:
 *                 type: number
 *                 description: The discount percentage offered by the coupon.
 *                 example: 20
 *               maxDiscount:
 *                 type: number
 *                 description: The max discount offered by the coupon.
 *                 example: 100
 *               expiry:
 *                 type: string
 *                 format: date
 *                 description: The expiration date of the coupon.
 *                 example: "2024-12-31"
 *               isActive:
 *                 type: boolean
 *                 description: The status of the coupon.
 *                 example: true
 *     responses:
 *       200:
 *         description: Coupon updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/coupon'
 *                 message:
 *                   type: string
 *                   example: "Coupon updated successfully"
 *       400:
 *         description: Bad request. Invalid input or missing required fields.
 *       401:
 *         description: Unauthorized. Authentication is required.
 *       403:
 *         description: Forbidden. Admin privileges are required.
 *       404:
 *         description: Coupon not found.
 *       500:
 *         description: Internal server error.
 */

couponRouter.put("/:couponId", authentication, checkAdminRole, updateCoupon);

/**
 * @swagger
 * /coupons/{couponId}:
 *   delete:
 *     summary: Delete a coupon
 *     description: Allows an admin user to delete an existing coupon by its ID.
 *     tags:
 *       - Coupons
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: couponId
 *         required: true
 *         description: The ID of the coupon to be deleted.
 *         schema:
 *           type: string
 *           example: "645dcb6b5e7f1b3b3b9e4bfc"
 *     responses:
 *       200:
 *         description: Coupon deleted successfully.
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
 *                   example: "Coupon deleted successfully"
 *       400:
 *         description: Bad request. Invalid input or missing required fields.
 *       401:
 *         description: Unauthorized. Authentication is required.
 *       403:
 *         description: Forbidden. Admin privileges are required.
 *       404:
 *         description: Coupon not found.
 *       500:
 *         description: Internal server error.
 */

couponRouter.delete("/:couponId", authentication, checkAdminRole, deleteCoupon);

/**
 * @swagger
 * /coupons:
 *   get:
 *     summary: Get all coupons
 *     description: Allows an admin user to retrieve all coupons in the store.
 *     tags:
 *       - Coupons
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all coupons.
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
 *                     coupons:
 *                       type: array
 *                       items:
 *                        $ref: '#/components/schemas/coupon'
 *                 message:
 *                   type: string
 *                   example: "Coupons retrieved successfully"
 *       400:
 *         description: Bad request. Invalid input or missing required fields.
 *       401:
 *         description: Unauthorized. Authentication is required.
 *       403:
 *         description: Forbidden. Admin privileges are required.
 *       500:
 *         description: Internal server error.
 */

couponRouter.get("/", authentication, checkAdminRole, getAllCoupons);

/**
 * @swagger
 * /coupons/{couponId}:
 *   get:
 *     summary: Get a specific coupon
 *     description: Allows an authenticated user to retrieve a specific coupon by its ID.
 *     tags:
 *       - Coupons
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: couponId
 *         in: path
 *         required: true
 *         description: The ID of the coupon to retrieve.
 *         schema:
 *           type: string
 *           example: "645dcb6b5e7f1b3b3b9e4bfc"
 *     responses:
 *       200:
 *         description: Successfully retrieved the coupon.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/coupon'
 *                 message:
 *                   type: string
 *                   example: "Coupon retrieved successfully"
 *       400:
 *         description: Bad request. Invalid coupon ID or missing parameter.
 *       401:
 *         description: Unauthorized. Authentication is required.
 *       404:
 *         description: Coupon not found. No coupon matches the given ID.
 *       500:
 *         description: Internal server error.
 */

couponRouter.get("/:couponId", authentication, getCoupon);

export default couponRouter;
