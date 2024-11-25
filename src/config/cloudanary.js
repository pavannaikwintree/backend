import {v2 as cloudinary} from 'cloudinary';
import { keys } from "./keys.js";

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: keys.cloundinary.name,
    api_key: keys.cloundinary.apiKey,
    api_secret: keys.cloundinary.apiSecret,
  });
};

export default connectCloudinary;