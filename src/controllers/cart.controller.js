import mongoose from "mongoose";
import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApplicationError from "../utils/applicationErrors.js";
import {
  clearCart,
  completeCheckout,
  createOrder,
} from "../services/cartServices.js";
import { processPayment } from "../services/paymentServices.js";

const addOrUpdateToCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { productId, quantity } = req.body;

    if (Number(quantity) === NaN) {
      throw new ApplicationError("Quantity must be a number", 400);
    }

    const product = await productModel.findById(productId);

    if (!product) {
      throw new ApplicationError("Product not found", 404);
    }

    let cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      cart = await cartModel({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item?.product?.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.total = existingItem.quantity * product.price;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        total: product.price * quantity,
      });
    }

    cart.status = "ACTIVE";
    await cart.save();

    return res
      .status(200)
      .json(new ApiResponse(true, cart, "Cart updated successfully"));
  } catch (error) {
    next(error);
  }
};

const getCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const cart = await cartModel
      .findOne({ user: userId })
      .populate("items.product");
    if (!cart) {
      throw new ApplicationError("no cart found", 400);
    }

    return res
      .status(200)
      .json(new ApiResponse(true, cart, "Cart retrived successfully"));
  } catch (error) {
    next(error);
  }
};

const removeItemFromCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;
    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      throw new ApplicationError("No cart found", 400);
    }

    const product = cart.items.find(
      (item) => item.product.toString() == productId
    );
    if (!product) {
      throw new ApplicationError("Product not present in cart", 400);
    }
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();
    return res
      .status(200)
      .json(
        new ApiResponse(true, cart, "Product removed from cart successfully")
      );
  } catch (error) {
    next(error);
  }
};

const emptyCart = async (req, res, next) => {
  try {
    const userId = req?.userId;
    let cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      throw new ApplicationError("User's cart not found", 400);
    }

    if (cart.items.length == 0) {
      throw new ApplicationError("Your cart is already empty.", 400);
    }

    cart = clearCart(cart);
    await cart.save();

    return res
      .status(200)
      .json(new ApiResponse(true, null, "Cart emptied successfully!"));
  } catch (error) {
    next(error);
  }
};

const checkoutCart = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.userId;
    const { couponCode } = req.body;
    const cart = await cartModel.findOne({ user: userId }).session(session);

    if (!cart) {
      throw new ApplicationError("Cart is not found", 400);
    }

    if (cart.items.length === 0) {
      throw new ApplicationError("Cart is empty", 400);
    }
    let discountAmount;
    if (couponCode) {
      discountAmount = await applyCoupon(couponCode, cart.totalPrice);
    }
    const order = await createOrder(cart, (discountAmount = 0), session); // create new order
    const paymentResult = await processPayment(order, session); // process payment
    if (!paymentResult.success) {
      throw new ApplicationError("Error while payment processing", 500);
    }

    const completedOrder = await completeCheckout(cart, order, session);
    await session.commitTransaction();
    session.endSession();
    return res
      .status(200)
      .json(new ApiResponse(true, completedOrder, "Order has been completed"));
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export {
  addOrUpdateToCart,
  getCart,
  removeItemFromCart,
  checkoutCart,
  emptyCart,
};
