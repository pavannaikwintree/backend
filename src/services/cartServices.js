import couponModel from "../models/coupon.model.js";
import orderModel from "../models/order.model.js";
import ApplicationError from "../utils/applicationErrors.js";

const createOrder = async (cart, discountAmount, session) => {
  try {
    const newOrder = new orderModel({
      user: cart.user,
      items: cart.items,
      totalQuantity: cart.totalQuantity,
      totalPrice: cart.totalPrice,
      discountAmount: discountAmount,
      priceAfterDiscount: cart.totalPrice - discountAmount,
      status: "PENDING",
    });

    await newOrder.save({ session });
    return newOrder;
  } catch (error) {
    throw new ApplicationError(
      `Error occurred while create order ${error.message}`,
      500
    );
  }
};

const completeCheckout = async (cart, order, session) => {
  try {
    order.status = "COMPLETED";
    await order.save({ session });

    //clear cart
    cart = clearCart(cart);
    cart.status = "CHECKOUT";
    await cart.save({ session });
    return order;
  } catch (error) {
    throw new ApplicationError(
      `Error occurred while complete checkout ${error.message}`,
      500
    );
  }
};

const clearCart = (cart) => {
  cart.items = [];
  cart.totalPrice = 0;
  cart.totalQuantity = 0;
  return cart;
};

const applyCoupon = async (couponCode, totalAmount) => {
  try {
    const coupon = await couponModel.findOne({
      name: couponCode.toUpperCase(),
    });
    if (!coupon) {
      throw new ApplicationError("Coupon code is not valid", 400);
    }

    let discountAmount =
      totalAmount - (totalAmount * coupon.discountAmount) / 100;

    return discountAmount;
  } catch (error) {
    throw new ApplicationError(error.message, error.code);
  }
};

export { createOrder, completeCheckout, applyCoupon, clearCart };
