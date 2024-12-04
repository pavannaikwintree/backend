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

couponRouter.post("/", authentication, checkAdminRole, createNewCoupon);

couponRouter.put("/:couponId", authentication, checkAdminRole, updateCoupon);

couponRouter.delete("/:couponId", authentication, checkAdminRole, deleteCoupon);

couponRouter.get("/", authentication, checkAdminRole, getAllCoupons);

couponRouter.get("/:couponId", authentication, getCoupon);

export default couponRouter;
