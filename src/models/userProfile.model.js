import mongoose from "mongoose";

// User Address Schema
const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

// User Schema
const userProfileSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true, unique: true },
    billingAddress: { type: addressSchema, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

const userProfileModel =
  mongoose.models.user || mongoose.model("userProfile", userProfileSchema);

export default userProfileModel;
