import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from 'crypto'
import hashToken from "../utils/hashToken.js";
import { keys } from "../config/keys.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password should be minimum 6 characters long"],
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
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cart",
    },
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

userSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  console.log(keys.jwt.accessTokenSecret);
  const accessToken = await jwt.sign(
    { userId: this._id },
    keys.jwt.accessTokenSecret,
    {
      expiresIn: keys.jwt.accessTokenExpiry,
    }
  );

  return accessToken;
};

userSchema.methods.generateRefreshToken = async () => {
  const refreshToken = await jwt.sign(
    { userId: this._id },
    keys.jwt.refreshTokenSecret,
    { expiresIn: keys.jwt.refreshTokenExpiry }
  );
  return refreshToken;
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
    tokenExpiry.getMinutes() + keys.resetToken.tokenExpiry
  );
  return { unHashedToken, hashedToken, tokenExpiry };
};

export const userAuthenticationModel = mongoose.model('users', userSchema);
