import { cloudinaryDelete, cloudinaryUpload } from "../config/cloudanary.js";
import categoryModel from "../models/categories.model.js";
import productModel from "../models/product.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApplicationError from "../utils/applicationErrors.js";
import { getLocalePath, getStaticUrl, deleteImage } from "../utils/helpers.js";
import mongoose from "mongoose";

//Get product by id
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (!product) {
      return res
        .status(404)
        .json(new ApiResponse(false, null, "Product not found"));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          { data: product },
          "Product retrieved successfully!"
        )
      );
  } catch (error) {
    next(error);
  }
};

// create product controller
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      categories,
      isFeatured,
    } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json(new ApiResponse(false, null, "Image path is required"));
    }

    const localPath = getLocalePath(req.file.filename);
    const imgResult = await cloudinaryUpload(localPath);

    // deleting file from local path
    // deleteImage(localPath);
    const image = {
      url: imgResult.secure_url,
      assetId: imgResult.asset_id,
      publicId: imgResult.public_id,
    };

    const newProduct = new productModel({
      name,
      description,
      shortDescription,
      price,
      categories,
      image,
      isFeatured,
    });
    const result = await newProduct.save();

    if (Array.isArray(categories)) {
      for (const category in categories) {
        await categoryModel.findOneAndUpdate(
          { name: categories[category] },
          { $addToSet: { products: result._id } }
        );
      }
    } else {
      await categoryModel.findOneAndUpdate(
        { name: categories },
        { $push: { products: result._id } }
      );
    }

    if (!result) {
      return new ApplicationError("Error in creating profile", 500);
    }

    return res
      .status(201)
      .json(
        new ApiResponse(true, { data: result }, "Profile created successfully!")
      );
  } catch (error) {
    next(error);
  }
};

// update product controller
// const updateProduct = async (req, res, next) => {
//   try {
//     const { id } = req.params; // Product ID from the route parameters
//     const {
//       name,
//       description,
//       shortDescription,
//       price,
//       categories,
//       subCategory,
//       isFeatured,
//     } = req.body;

//     // Fetch the existing product
//     const existingProduct = await productModel.findById(id);

//     if (!existingProduct) {
//       throw new ApplicationError("Product not found", 404);
//     }

//     let image = existingProduct.image;

//     if (req.file) {
//       const localPath = getLocalePath(req.file.filename);
//       const imgResult = await cloudinaryUpload(localPath);
//       deleteImage(localPath);
//       image = {
//         url: imgResult.secure_url,
//         assetId: imgResult.asset_id,
//         publicId: imgResult.public_id,
//       };
//     }

//     // Update product fields
//     existingProduct.name = name || existingProduct.name;
//     existingProduct.description = description || existingProduct.description;
//     existingProduct.shortDescription =
//       shortDescription || existingProduct.shortDescription;
//     existingProduct.price = price || existingProduct.price;
//     existingProduct.categories = categories || existingProduct.categories;
//     existingProduct.subCategory = subCategory || existingProduct.subCategory;
//     existingProduct.isFeatured =
//       isFeatured !== undefined ? isFeatured : existingProduct.isFeatured;
//     existingProduct.image = image;

//     const updatedProduct = await existingProduct.save();

//     if (categories) {
//       if (Array.isArray(categories)) {
//         for (const category in categories) {
//           await categoryModel.findOneAndUpdate(
//             { name: categories[category] },
//             { $addToSet: { products: updatedProduct._id } }
//           );
//         }
//       } else {
//         await categoryModel.findOneAndUpdate(
//           { name: categories },
//           { $addToSet: { products: updatedProduct._id } }
//         );
//       }
//     }

//     return res
//       .status(200)
//       .json(
//         new ApiResponse(true, updatedProduct, "Product updated successfully!")
//       );
//   } catch (error) {
//     next(error);
//   }
// };

const updateProduct = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { id } = req.params;
    const {
      name,
      description,
      shortDescription,
      price,
      categories,
      subCategory,
      isFeatured,
    } = req.body;

    // Fetch the existing product
    const existingProduct = await productModel.findById(id).session(session);

    if (!existingProduct) {
      throw new ApplicationError("Product not found", 404);
    }

    let image = existingProduct.image;

    if (req.file) {
      const localPath = getLocalePath(req.file.filename);
      const imgResult = await cloudinaryUpload(localPath);
      deleteImage(localPath);
      image = {
        url: imgResult.secure_url,
        assetId: imgResult.asset_id,
        publicId: imgResult.public_id,
      };
    }

    // Extract old categories
    const oldCategories = existingProduct.categories || [];

    // Update product fields
    existingProduct.name = name || existingProduct.name;
    existingProduct.description = description || existingProduct.description;
    existingProduct.shortDescription =
      shortDescription || existingProduct.shortDescription;
    existingProduct.price = price || existingProduct.price;
    existingProduct.categories = categories || existingProduct.categories;
    existingProduct.subCategory = subCategory || existingProduct.subCategory;
    existingProduct.isFeatured =
      isFeatured !== undefined ? isFeatured : existingProduct.isFeatured;
    existingProduct.image = image;

    const updatedProduct = await existingProduct.save({ session });

    // Handle category updates
    if (categories) {
      let categoriesToAdd = null;
      const categoriesToRemove = oldCategories.filter(
        (category) => !categories.includes(category)
      );
      if (Array.isArray(categories)) {
        categoriesToAdd = categories.filter(
          (category) => !oldCategories.includes(category)
        );
      } else {
        categoriesToAdd = [categories];
      }

      // Remove product from old categories
      if (categoriesToRemove.length > 0) {
        await categoryModel.updateMany(
          { name: { $in: categoriesToRemove } },
          { $pull: { products: updatedProduct._id } },
          { session }
        );
      }

      // Add product to new categories
      if (categoriesToAdd.length > 0) {
        await categoryModel.updateMany(
          { name: { $in: categoriesToAdd } },
          { $addToSet: { products: updatedProduct._id } },
          { session }
        );
      }
    }
    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(
        new ApiResponse(true, updatedProduct, "Product updated successfully!")
      );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// get all products
const getProducts = async (req, res, next) => {
  try {
    let { page = 1 } = req.query;
    const {
      limit = 10,
      sort = "-createdAt",
      categories,
      isFeatured,
    } = req.query;

    // creating filter
    const filter = {};
    if (categories) filter.categories = { $in: categories.split(",") };
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === "true";

    // checking number of products
    const totalProducts = await productModel.countDocuments(filter);
    if (!totalProducts) {
      return res
        .status(200)
        .json(new ApiResponse(true, [], "No products found matching criteria"));
    }

    const totalPages = parseInt(
      Math.ceil(parseInt(totalProducts, 10) / parseInt(limit, 10)),
      10
    );
    if (totalPages < page) {
      page = parseInt(totalPages, 10);
    }

    const skip = (page - 1) * limit;

    const products = await productModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit, 10));

    return res.status(200).json(
      new ApiResponse(
        true,
        {
          products: products,
          pagination: {
            total: totalProducts,
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            totalPages: totalPages,
          },
        },
        "Products retrieved successfully!"
      )
    );
  } catch (error) {
    next(error);
  }
};

// delete product controller
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProduct = await productModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      throw new ApplicationError("Product not found", 404);
    }
    await cloudinaryDelete(deletedProduct?.image?.publicId);
    if (deletedProduct.categories.length > 0) {
      for (const category in deletedProduct.categories)
        await categoryModel.findOneAndUpdate(
          { name: deletedProduct.categories[category] },
          { $pull: { products: deletedProduct._id } }
        );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          { data: deletedProduct },
          "Product deleted successfully!"
        )
      );
  } catch (error) {
    next(error);
  }
};

export {
  createProduct,
  getProductById,
  updateProduct,
  getProducts,
  deleteProduct,
};
