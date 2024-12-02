import mongoose from "mongoose";

const couponSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator: async function (value) {
          const existingDoc = await this.constructor.findOne({ name: value });

          return !existingDoc || existingDoc._id.equals(this._id);
        },
        message: "Coupon name must be unique",
      },
    },
    discount: {
      type: Number,
      required: true,
    },
    expiry: {
      type: Date,
      required: true,
    },
    maxDiscount: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const couponModel = new mongoose.model("coupon", couponSchema);

export default couponModel;
