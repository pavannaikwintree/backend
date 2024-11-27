import mongoose from "mongoose";
import categoryModel from "./categories.model.js";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
    },
    price: {
      type: Number,
      min: 0,
    },
    image: {
      type: {
        url: String,
        assetId: String,
        publicId: String,
      },
      required: true,
    },
    categories: {
      type: [String],
      validate: {
        validator: async function (categories) {
          // Check if all categories exist in the database
          const existingCategories = await categoryModel
            .find({
              name: { $in: categories },
            })
            .select("name");
          return existingCategories.length === categories.length;
        },
        message: "Some categories are invalid or do not exist.",
      },
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
