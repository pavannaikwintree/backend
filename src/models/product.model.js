import mongoose from "mongoose";

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
        localPath: String,
      },
      required: true,
    },
    categories: {
      type: [String],
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "At least one category is required",
      },
      required: true,
    },
    subCategory: {
      type: String,
    },
    sizes: {
      type: Array,
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
