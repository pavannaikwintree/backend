import mongoose from "mongoose";
import { keys } from "./keys.js";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("DB connected!");
  });
  await mongoose.connect(`${keys.dbUri}/ecommerce`);
};

export default connectDB;