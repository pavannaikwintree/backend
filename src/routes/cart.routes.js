import express from "express";
import authentication from "../middlewares/authentication.middleware.js";
import {
  addToCart,
  checkoutCart,
  getCart,
  removeItemFromCart,
} from "../controllers/cart.controller.js";

const cartRouter = express.Router();

cartRouter.post("/add", authentication, addToCart);

cartRouter.put("/update", authentication, addToCart);

cartRouter.post("/remove", authentication, removeItemFromCart);

cartRouter.get("/", authentication, getCart);

cartRouter.post("/checkout", authentication, checkoutCart);

export default cartRouter;
