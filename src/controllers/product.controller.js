import productModel from "../models/product.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApplicationError from "../utils/applicationErrors.js";
import { getLocalePath, getStaticUrl } from "../utils/helpers.js";
import fs from "fs";

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

const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      category,
      subCategory,
      isFeatured,
    } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json(new ApiResponse(false, null, "Image path is required"));
    }

    const url = getStaticUrl(req, req.file.filename);
    const localPath = getLocalePath(req.file.filename);
    const image = {
      url,
      localPath,
    };
    const newProduct = new productModel({
      name,
      description,
      shortDescription,
      price,
      category,
      image,
      subCategory,
      isFeatured,
    });
    const result = await newProduct.save();

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

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params; // Product ID from the route parameters
    const {
      name,
      description,
      shortDescription,
      price,
      category,
      subCategory,
      isFeatured,
    } = req.body;

    // Fetch the existing product
    const existingProduct = await productModel.findById(id);
    if (!existingProduct) {
      return res
        .status(404)
        .json(new ApiResponse(false, null, "Product not found"));
    }

    let image = existingProduct.image;
    if (req.file) {
      const url = getStaticUrl(req, req.file.filename);
      const localPath = getLocalePath(req.file.filename);
      image = { url, localPath };
    }

    // Update product fields
    existingProduct.name = name || existingProduct.name;
    existingProduct.description = description || existingProduct.description;
    existingProduct.shortDescription =
      shortDescription || existingProduct.shortDescription;
    existingProduct.price = price || existingProduct.price;
    existingProduct.category = category || existingProduct.category;
    existingProduct.subCategory = subCategory || existingProduct.subCategory;
    existingProduct.isFeatured =
      isFeatured !== undefined ? isFeatured : existingProduct.isFeatured;
    existingProduct.image = image;

    const updatedProduct = await existingProduct.save();

    return res
      .status(200)
      .json(
        new ApiResponse(true, updatedProduct, "Product updated successfully!")
      );
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "-createdAt",
      category,
      isFeatured,
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === "true";

    const skip = (page - 1) * limit;

    const products = await productModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit, 10));

    const totalProducts = await productModel.countDocuments(filter);

    return res.status(200).json(
      new ApiResponse(
        true,
        {
          data: products,
          pagination: {
            total: totalProducts,
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            totalPages: Math.ceil(totalProducts / limit),
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
      return res
        .status(404)
        .json(new ApiResponse(false, null, "Product not found"));
    }
    const filePath = deletedProduct.image.localPath;
    if (filePath) {
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
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
