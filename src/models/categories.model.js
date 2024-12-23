import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
  name: {
    type: String,
    minlength: [3, "minimum 3 characters are required"],
    unique: true,
  },
  products: [
    {
      type: mongoose.Types.ObjectId,
      ref: "product",
    },
  ],
});

const categoryModel = mongoose.model("categories", categorySchema);

export default categoryModel;
