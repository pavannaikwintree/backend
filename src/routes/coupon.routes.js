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

couponRouter.put("/:couponId", updateCoupon);

couponRouter.delete("/:couponId", deleteCoupon);

couponRouter.get("/", getAllCoupons);

couponRouter.get("/:", getCoupon);

export default couponRouter;
