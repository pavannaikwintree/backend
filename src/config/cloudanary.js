import { v2 as cloudinary } from "cloudinary";
import { keys } from "./keys.js";
import ApplicationError from "../utils/applicationErrors.js";

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: keys.cloundinary.name,
    api_key: keys.cloundinary.apiKey,
    api_secret: keys.cloundinary.apiSecret,
  });
};

export const cloudinaryUpload = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      use_filename: true,
    });

    return result;
  } catch (error) {
    throw new ApplicationError(
      "Something went wrong while uploading image",
      500
    );
  }
};

export const cloudinaryDelete = async (fileId) => {
  try {
    const result = await cloudinary.uploader.destroy(fileId);
    return result;
  } catch (error) {
    throw new ApplicationError(error.message, 500);
  }
};

export default connectCloudinary;
