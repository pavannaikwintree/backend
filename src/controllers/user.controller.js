import { userAuthenticationModel } from "../models/userAuthentication.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApplicationError from "../utils/applicationErrors.js";
import sendEmail from "../utils/sendEmail.js";
import hashToken from "../utils/hashToken.js";
import { keys } from "../config/keys.js";
import jwt from "jsonwebtoken";

const cookieOptions = {
  maxAge: Number(keys.cookie.expiry) * 86400000, // Convert days to milliseconds
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
};

// Route for user login
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Fetch user by email
    const user = await userAuthenticationModel.findOne({ email });
    if (!user) {
      return next(new ApplicationError("User not found", 404));
    }

    // Verify password
    const isPasswordValid = await user.verifyPassword(password);

    if (!isPasswordValid) {
      throw new ApplicationError("Invalid email or password", 400);
    }

    const accessToken = await user.generateAccessToken();

    // Prepare user data without password field
    const { password: _, ...userData } = user.toObject();

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .json(
        new ApiResponse(
          true,
          { accessToken, user: userData },
          "Login Successful!"
        )
      );
  } catch (error) {
    next(error);
  }
};

// Route for user registration
const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Create and save a new user
    const newUser = new userAuthenticationModel({
      firstName,
      lastName,
      email,
      password,
    });
    await newUser.save();

    const accessToken = await newUser.generateAccessToken();

    // Exclude password from the user data
    const { password: _, ...userData } = newUser.toObject();
    return res
      .status(201)
      .cookie("accessToken", accessToken, cookieOptions)
      .json(
        new ApiResponse(
          true,
          { accessToken, user: userData },
          "User created successfully!"
        )
      );
  } catch (error) {
    next(error);
  }
};

const verifyRefreshToken = async (req, res, next) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApplicationError("Unauthorized request", 400);
    }
    const decode = await jwt.verify(incomingRefreshToken);

    if (!decodedToken) {
      throw new ApplicationError(
        "Something went wrong while verifying refresh token",
        500
      );
    }
    const user = decode.payload.userId;
    if (!user) {
      throw new ApplicationError("Invalid token", 400);
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    return res
      .staus(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .json(
        new ApiResponse(
          true,
          { accessToken, refreshToken },
          "token generated successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

//forgot password controller
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.query;
    const user = await userAuthenticationModel.findOne({ email: email });

    if (!user) {
      throw new ApplicationError("User not found", 404);
    }

    const { unHashedToken, hashedToken, tokenExpiry } =
      await user.generateTemporaryToken();
    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordExpiry = tokenExpiry;
    await user.save({ validateBeforeSave: false });
    const host = req.get("host");
    const emailToken = `${req.protocol}://${host}${req.baseUrl}/reset-password/${unHashedToken}`;
    console.log(emailToken);
    const result = await sendEmail(email, emailToken);
    if (result) {
      return res.json(
        new ApiResponse(
          true,
          {},
          "A password reset link has been sent to your email."
        )
      );
    }
  } catch (error) {
    next(error);
  }
};

// Reset password controller
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const hashedToken = hashToken(token);
    const user = await userAuthenticationModel.findOne({
      forgotPasswordToken: hashedToken,
      forgotPasswordExpiry: { $gt: new Date() },
    });
    if (!user) {
      throw new ApplicationError("Invalid reset link", 404);
    }

    user.password = newPassword;
    await user.save();
    return res
      .status(202)
      .json(new ApiResponse(true, {}, "A password changed successfully!"));
  } catch (error) {
    next(error);
  }
};

// logout user
const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie();
    return res
      .status(200)
      .json(new ApiResponse(true, null, "user logged out successfully!"));
  } catch (error) {
    next(error);
  }
};

export {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
  verifyRefreshToken,
  logoutUser,
};
