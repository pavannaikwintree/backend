import ApiResponse from "../utils/apiResponse.js";
import categoryModel from "../models/categories.model.js";
import ApplicationError from "../utils/applicationErrors.js";

//add new category
const addCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const newCategory = new categoryModel({ name: name.toLowerCase() });
    const result = await newCategory.save();
    return res
      .status(201)
      .json(
        new ApiResponse(
          true,
          { data: result },
          "New category created successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

//get single category
const getCategory = async (req, res, next) => {
  try {
    const { categoryName } = req.params;
    const category = await categoryModel.findOne({ name: categoryName });
    if (!category) {
      return res
        .status(404)
        .send(new ApiResponse(false, null, "No category found"));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          { data: category },
          "Category retrived successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

// get all categories
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryModel.find();
    if (!categories) {
      throw new ApplicationError("No category found", 404);
    }
    return res
      .status(200)
      .json(
        new ApiResponse(true, categories, "Categories retrived successfully")
      );
  } catch (error) {
    next(error);
  }
};

//delete category by name or ID
const deleteCategory = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
    const filter = isObjectId ? { _id: identifier } : { name: identifier };
    const deletedCategory = await categoryModel.findOneAndDelete(filter);
    if (!deletedCategory) {
      throw new ApplicationError("No category found!", 404);
    }
    return res
      .status(200)
      .json(
        new ApiResponse(true, deletedCategory, "Category deleted successfully")
      );
  } catch (error) {
    next(error);
  }
};

export { addCategory, getCategory, getAllCategories, deleteCategory };
