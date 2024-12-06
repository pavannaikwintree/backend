import orderModel from "../models/order.model.js";
import ApplicationError from "../utils/applicationErrors.js";

const createOrder = async (cart, session) => {
  try {
    const newOrder = new orderModel({
      user: cart.user,
      items: cart.items,
      totalQuantity: cart.totalQuantity,
      totalPrice: cart.totalPrice,
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
    cart.items = [];
    cart.totalPrice = 0;
    cart.totalQuantity = 0;
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

export { createOrder, completeCheckout };
