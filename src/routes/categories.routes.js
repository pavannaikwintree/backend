import express from "express";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
} from "../controllers/categories.controller.js";
import authentication from "../middlewares/authentication.middleware.js";

const categoryRouter = express.Router();

categoryRouter.post("/", authentication, addCategory);

categoryRouter.get("/:categoryName", authentication, getCategory);

categoryRouter.get("/", authentication, getAllCategories);

categoryRouter.delete("/:identifier", authentication, deleteCategory);

export default categoryRouter;
