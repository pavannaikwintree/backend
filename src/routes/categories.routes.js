import express from "express";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
} from "../controllers/categories.controller.js";
import authentication from "../middlewares/authentication.middleware.js";
import checkAdminRole from "../middlewares/checkRole.middleware.js";

const categoryRouter = express.Router();

categoryRouter.post("/", authentication, checkAdminRole, addCategory);

categoryRouter.get("/", authentication, getAllCategories);

categoryRouter.get("/:categoryName", authentication, getCategory);

categoryRouter.delete(
  "/:identifier",
  authentication,
  checkAdminRole,
  deleteCategory
);

export default categoryRouter;
