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

export const cloudinaryUpload = async (file, options = {}) => {
  // try {
  //   const result = await cloudinary.uploader.upload(filePath, {
  //     use_filename: true,
  //   });

  //   return result;
  // } catch (error) {
  //   throw new ApplicationError(`Cloudinary Error: ${error}`, 500);
  // }

  if (Buffer.isBuffer(file)) {
    // Handle Buffer uploads
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "products", ...options }, // Add folder or other options here
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(file); // Stream the buffer to Cloudinary
    });
  } else if (typeof file === "string") {
    // Handle file path uploads
    try {
      const result = await cloudinary.uploader.upload(file, {
        folder: "products",
        ...options,
      });
      return result;
    } catch (error) {
      throw new Error(error.message || "Failed to upload file to Cloudinary");
    }
  } else {
    throw new Error("Invalid file type. Must be a Buffer or file path.");
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
