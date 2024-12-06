import jwt from "jsonwebtoken";
import { keys } from "../config/keys.js";
import ApplicationError from "../utils/applicationErrors.js";

const authentication = (req, res, next) => {
  if (!req.cookies?.accessToken) {
    throw new ApplicationError("Unauthorized request", 400);
  }
  try {
    const token = req.cookies?.accessToken;
    const verifyToken = jwt.verify(token, keys.jwt.accessTokenSecret);
    if (!verifyToken) {
      throw new ApplicationError("Invalid token", error.code || 400);
    }
    req.userId = verifyToken.userId;
    next();
  } catch (error) {
    next(error);
  }
};

export default authentication;
