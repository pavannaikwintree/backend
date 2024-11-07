import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./src/config/mongodb.js";
import connectCloudinary from "./src/config/cloudanary.js";
import userRouter from "./src/routes/user.routes.js";
import ApiResponse from "./src/utils/apiResponse.js";
import cookieParser from "cookie-parser";
import swaggerDocs from "./src/utils/swagger.js";
import { keys } from "./src/config/keys.js";

// App Config
const app = express();
const port = keys.port || 8080;
swaggerDocs(app, port); //initalizing swagger docs UI

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// API endpoints
app.use("/api/users", userRouter);

app.get("/", (req, res) => {
  res.send("API Working!!");
});

app.use("*", (req, res, next) => {
  res.status(404).json(new ApiResponse(false, {}, "Requested url not found!"));
});

// Application level Error handling
app.use((err, req, res, next) => {
  const statusCode = err.code || 500;
  res
    .status(statusCode)
    .json(
      new ApiResponse(
        false,
        null,
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
    console.error(error);
  }
});
