import mongoose from "mongoose";
import { cartStatus } from "../config/constants.js";

export const cartItemSchema = mongoose.Schema({
  product: {
    type: mongoose.Types.ObjectId,
    ref: "product",
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be atleast 1"],
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be a negative number"],
  },
  total: {
    type: Number,
    required: true,
    min: [0, "Total cannot be a negative number"],
  },
});

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [cartItemSchema],
    totalQuantity: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    },
    status: {
      type: String,
      enum: [...cartStatus],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

cartSchema.pre("save", function (next) {
  this.totalQuantity = this.items?.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  this.totalPrice = this.items?.reduce((sum, item) => sum + item.total, 0);
  next();
});

const cartModel = mongoose.model("cart", cartSchema);

export default cartModel;
