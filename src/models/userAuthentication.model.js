import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from 'crypto'
import hashToken from "../utils/hashToken.js";
import ApplicationError from "../utils/applicationErrors.js";


const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required']
    },
    lastName:{
        type: String,
        required: [true, 'Last name is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min:[6, 'Password should be minimum 6 characters long']
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// userSchema.post("save", async function (user, next) {
//   const socialProfile = await ProfileModel.findOne({ owner: user._id });
//   if (!socialProfile) {
//     await ProfileModel.create({ owner: user._id });
//   }
//   next();
// });

userSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  const token = await jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
  return token;
};

userSchema.methods.clearSession = async function (token) {
  if (this.sessions.includes(token)) {
    const index = this.sessions.findIndex((i) => token === i);
    this.sessions.splice(index, 1);
    return true;
  }
  return false;
};

userSchema.methods.generateTemporaryToken = async function () {
  const unHashedToken = crypto.randomBytes(20).toString("hex");
  const hashedToken = await hashToken(unHashedToken);
  const tokenExpiry = new Date();
  tokenExpiry.setMinutes(
    tokenExpiry.getMinutes() + process.env.TEMP_TOKEN_EXPIRY
  );
  return { unHashedToken, hashedToken, tokenExpiry };
};

export const userAuthenticationModel = mongoose.model('users', userSchema);
