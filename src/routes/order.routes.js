import express from "express";
import {
  getOrder,
  getOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import authentication from "../middlewares/authentication.middleware.js";
import checkAdminRole from "../middlewares/checkRole.middleware.js";

const orderRouter = express.Router();

orderRouter.get("/", authentication, getOrders); // get all admin orders
orderRouter.get("/:orderId", authentication, getOrder); // get order
orderRouter.put("/:orderId", authentication, checkAdminRole, updateOrderStatus); //change order status

export default orderRouter;
