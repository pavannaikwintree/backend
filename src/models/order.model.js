import mongoose from "mongoose";
import { cartItemSchema } from "./cart.model.js";
import { orderStatus } from "../config/constants.js";

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
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
    enum: [...orderStatus],
    requied: true,
    default: "ACTIVE",
  },
});

const orderModel = mongoose.model("order", orderSchema);
