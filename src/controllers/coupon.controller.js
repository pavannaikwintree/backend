import couponModel from "../models/coupon.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApplicationError from "../utils/applicationErrors.js";
import { getFormattedDate } from "../utils/helpers.js";

// create new coupon
const createNewCoupon = async (req, res, next) => {
  try {
    const { code, discount, isActive, maxDiscount } = req.body;
    let expiry = getFormattedDate(req?.body?.expiry);
    const newCoupon = new couponModel({
      code: code.toUpperCase(),
      discount,
      expiry,
      isActive,
      maxDiscount,
    });
    await newCoupon.save();
    return res
      .status(201)
      .json(new ApiResponse(true, newCoupon, "Coupon created successfully"));
  } catch (error) {
    next(error);
  }
};

//update coupon controller
const updateCoupon = async (req, res, next) => {
  try {
    const { code, discount, expiry, isActive, maxDiscount } = req.body;
    const { couponId } = req.params;

    const existingCoupon = await couponModel.findOne({ _id: couponId });

    if (!existingCoupon) {
      throw new ApplicationError("Coupon does not exist", 404);
    }
    if (expiry) {
      let temp = getFormattedDate(expiry);
      existingCoupon.expiry = temp || existingCoupon.expiry;
    }
    existingCoupon.code = code || existingCoupon.code;
    existingCoupon.discount = discount || existingCoupon.discount;
    existingCoupon.isActive = isActive || existingCoupon.isActive;
    existingCoupon.maxDiscount = maxDiscount || existingCoupon.maxDiscount;

    await existingCoupon.save();

    return res
      .status(200)
      .json(
        new ApiResponse(true, existingCoupon, "Coupon updated successfully")
      );
  } catch (error) {
    next(error);
  }
};

//delete coupon
const deleteCoupon = async (req, res, next) => {
  try {
    const { couponId } = req.params;
    const deletedCoupon = await couponModel.findOneAndDelete({ _id: couponId });
    if (!deletedCoupon) {
      throw new ApplicationError("Coupon does not exist", 404);
    }

    return res
      .status(200)
      .json(
        new ApiResponse(true, deletedCoupon, "Coupon deleted successfully!")
      );
  } catch (error) {
    next(error);
  }
};

//get list of coupons
const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await couponModel.find();
    if (!coupons) {
      throw new ApplicationError("No coupons found", 404);
    }
    return res
      .status(200)
      .json(new ApiResponse(true, coupons, "Coupons retrived successfully!"));
  } catch (error) {
    next(error);
  }
};

//get single coupon
const getCoupon = async (req, res, next) => {
  try {
    const { couponId } = req.params;
    const coupon = await couponModel.findById(couponId);
    if (!coupon) {
      throw new ApplicationError("No coupon found", 404);
    }
    return res
      .status(200)
      .json(new ApiResponse(true, coupon, "Coupon retrived successfully"));
  } catch (error) {
    next(error);
  }
};

export {
  createNewCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCoupons,
  getCoupon,
};
