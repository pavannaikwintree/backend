import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required']
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: Array,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    sizes: {
      type: Array,
      required: true,
    },
    isFeatured: {
      type: Boolean,
    },
    date: {
      type: Number,
    },
  },
  { timestamps: true }
);

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
