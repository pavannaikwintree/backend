import { cloudinaryDelete, cloudinaryUpload } from "../config/cloudanary.js";
import productModel from "../models/product.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApplicationError from "../utils/applicationErrors.js";
import { getLocalePath, getStaticUrl, deleteImage } from "../utils/helpers.js";

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
    deleteImage(localPath);
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
      categories,
      subCategory,
      isFeatured,
    } = req.body;

    // Fetch the existing product
    const existingProduct = await productModel.findById(id);

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

    const totalPages = Math.ceil(totalProducts / limit);

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
