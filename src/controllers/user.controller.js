import { userAuthenticationModel } from "../models/userAuthentication.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApplicationError from "../utils/applicationErrors.js";
import sendEmail from "../utils/sendEmail.js";
import hashToken from "../utils/hashToken.js";
import { keys } from "../config/keys.js";

// Route for user login
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await userAuthenticationModel.findOne({ email: email });
    if (!user) {
      throw new ApplicationError("User not found", 404);
    }
    const result = await user.verifyPassword(password);

    if (!result) {
      throw new ApplicationError("Invalid email or password", 400);
    }

    const token = await user.generateAccessToken();
    await user.save();
    res.cookie("jwt", token, {
      maxAge: `${Number(keys.cookie.expiry) * 86400000}`,
    });
    res.status(200).json(new ApiResponse(true, { token }, "Login Successful!"));
  } catch (error) {
    next(error);
  }
};

// Route for user registration
const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const newUser = new userAuthenticationModel({
      firstName,
      lastName,
      email,
      password,
    });
    const result = await newUser.save();
    let token;
    // generate token and set with cookie
    if (result) {
       token = await newUser.generateAccessToken();
      res.cookie("jwt", token, {
        maxAge: `${Number(keys.cookie.expiry) * 86400000}`,
      });
    }
    const userData = await userAuthenticationModel
      .findById(newUser._id)
      .select("-password");
    res
      .status(201)
      .json(new ApiResponse(true, {token, userData}, "User created successfully!"));
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

export { loginUser, registerUser, forgotPassword, resetPassword };
