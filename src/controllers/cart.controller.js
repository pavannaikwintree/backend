import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { userAuthenticationModel } from "../models/userAuthentication.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApplicationError from "../utils/applicationErrors.js";

const addToCart = async (req, res, next) => {
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

const checkoutCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const cart = await cart.findOne({ user: userId });

    if (!cart) {
      throw new ApplicationError("no cart found", 400);
    }

    if (cart.items.length === 0) {
      throw new ApplicationError("Cart is empty", 400);
    }
    cart.status = "CHECKOUT";
    await cart.save();
    return res
      .status(200)
      .json(new ApiResponse(true, cart, "Cart moved to checkout"));
  } catch (error) {
    next(error);
  }
};

export { addToCart, getCart, removeItemFromCart, checkoutCart };
