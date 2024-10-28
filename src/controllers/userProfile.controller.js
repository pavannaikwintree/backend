import mongoose from "mongoose";
import userProfileModel from "../models/userProfile.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApplicationError from "../utils/applicationErrors.js";

//Retrives user profile
export const getProfile = async (req, res, next) => {
  const { userId } = req?.userId;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new ApplicationError("User profile not found", 404);
    }

    let profile = await userProfileModel.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId)
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "Account",
          pipeline: [
            {
              $project: {
                firstName: 1,
                lastName: 1,
                email: 1,
                role: 1,
              },
            },
          ],
        },
      },
    ]);

    if (!profile) {
      throw new ApplicationError("User profile not found", 404);
    }
    return res.json(new ApiResponse(true, profile[0], "Profile retrived successfully"));
  } catch (error) {
    next(error);
  }
};

//creates user profiles
export const createProfile = async (req, res, next) => {
  const { email, phoneNumber, billingAddress } = req.body;
  const userId = req?.userId;
  try {
    const newProfile = new userProfileModel({
      email,
      phoneNumber,
      billingAddress,
      owner: userId,
    });
    const profile = await newProfile.save();
    if (!profile) {
      throw new ApplicationError("Internal Server Error", 500);
    }
    return res.json(
      new ApiResponse(true, newProfile, "User profile created successfully!")
    );
  } catch (error) {
    next(error);
  }
};

//update user profile
export const updateProfile = async (req, res, next) => {
  const { email, phoneNumber, billingAddress } = req.body;
  const userId = req?.userId;
  try {
    let profile = await userProfileModel.findOneAndUpdate(
      {
        owner: new mongoose.Types.ObjectId(userId),
      },
      {
        $set: {
          phoneNumber,
          billingAddress,
        },
      },
      { new: true }
    );

    return res.json(
      new ApiResponse(true, profile, "User profile created successfully!")
    );
  } catch (error) {
    next(error);
  }
};
