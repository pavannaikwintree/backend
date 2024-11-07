import {v2 as cloudinary} from 'cloudinary';
import { keys } from "./keys.js";

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: keys.cloundaryName,
    api_key: keys.cloundaryApiKey,
    api_secret: keys.cloundaryApiSecret,
  });
};

export default connectCloudinary;