import ApiResponse from "../utils/apiResponse.js";
import categoryModel from "../models/categories.model.js";
import ApplicationError from "../utils/applicationErrors.js";
import productModel from "../models/product.model.js";

//Add new category
const addCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const newCategory = new categoryModel({ name: name.toLowerCase() });
    const result = await newCategory.save();
    return res
      .status(201)
      .json(new ApiResponse(true, result, "New category created successfully"));
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
      .json(new ApiResponse(true, category, "Category retrived successfully"));
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
    const { categoryId } = req.params;
    const deletedCategory = await categoryModel.findOneAndDelete({
      _id: categoryId,
    });

    if (!deletedCategory) {
      throw new ApplicationError("No category found!", 404);
    }

    if (deletedCategory.products && deletedCategory.products.length > 0) {
      const updatePromise = deletedCategory.products.map((product) => {
        return productModel.findOneAndUpdate(
          { _id: product },
          { $pull: { categories: product } }
        );
      });

      const updateResult = await Promise.allSettled(updatePromise);

      const failedResult = updateResult.filter(
        (result) => result.status == "rejected"
      );

      if (failedResult.length > 0) {
        throw new ApplicationError("Failed to update associated products", 500);
      }
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

// delete bulk categories
const deleteCategories = async (req, res, next) => {
  try {
    const { categoryIds } = req?.body;

    if (categoryIds.length <= 0) {
      throw new ApplicationError("Please provide categoryID");
    }

    const categoriesToDelete = await categoryModel.find({
      _id: { $in: categoryIds },
    });

    if (!categoriesToDelete || categoriesToDelete.length <= 0) {
      throw new ApplicationError("Categories not found", 404);
    }

    const allProducts = categoriesToDelete.flatMap(
      (category) => category.products
    );

    console.log("All products", allProducts);
    const allCategoriesId = categoriesToDelete.map((category) => category._id);
    console.log(allCategoriesId);
    await productModel.updateMany(
      { _id: { $in: allProducts } },
      { $pull: { categories: { $in: allCategoriesId } } }
    );

    const result = await categoryModel.deleteMany({
      _id: { $in: categoryIds },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(true, null, `${result.deletedCount} categories deleted`)
      );
  } catch (error) {
    next(error);
  }
};

export {
  addCategory,
  getCategory,
  getAllCategories,
  deleteCategory,
  deleteCategories,
};
