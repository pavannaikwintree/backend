import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./src/config/mongodb.js";
import connectCloudinary from "./src/config/cloudanary.js";
import ApiResponse from "./src/utils/apiResponse.js";
import cookieParser from "cookie-parser";
import swaggerDocs from "./src/config/swagger.js";
import { keys } from "./src/config/keys.js";
import {
  userRouter,
  productRouter,
  categoryRouter,
  couponRouter,
} from "./src/routes/index.js";
import cartRouter from "./src/routes/cart.routes.js";
import orderRouter from "./src/routes/order.routes.js";
import ApplicationError from "./src/utils/applicationErrors.js";

// App Config
const app = express();
const port = keys.port || 8080;
swaggerDocs(app, port); //initalizing swagger docs UI

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(
  cors({
    origin: keys.corsOrigin,
    credentials: true,
  })
);

// API endpoints
app.use("/api/users", userRouter); // routes for users
app.use("/api/products", productRouter); // routes for product
app.use("/api/categories", categoryRouter); // routes for category
app.use("/api/coupons", couponRouter); // routes for coupon
app.use("/api/cart", cartRouter); // routes for cart
app.use("/api/orders", orderRouter); // routes to handle orders

//Test to check route
app.get("/", (req, res) => {
  res.send("API Working!!");
});

// Handling incorrect routes
app.use("*", (req, res, next) => {
  res.status(404).json(new ApiResponse(false, {}, "Requested url not found!"));
});

// Application level Error handling
app.use((err, req, res, next) => {
  console.log("Error", err.message, err.code);
  const statusCode = err.code || 500;
  res
    .status(statusCode)
    .json(
      new ApiResponse(
        false,
        "Error",
        err.message || "An unexpected error occurred"
      )
    );
});

app.listen(port, async () => {
  try {
    console.log("server started at port " + port);
    connectDB(); //Initiate database connection
    connectCloudinary(); // initiate cloudinary
  } catch (error) {
    throw new ApplicationError("Error in initiating server", 500);
  }
});
