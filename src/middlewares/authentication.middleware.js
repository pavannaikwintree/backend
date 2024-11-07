import jwt from 'jsonwebtoken';
import ApiResponse from '../utils/apiResponse.js';
import { keys } from "../config/keys.js";

const authentication = (req, res, next) => {
  if (!req.cookies?.jwt) {
    return res.json(new ApiResponse(false, {}, "Unauthorized Access"));
  }
  try {
    const token = req?.cookies?.jwt;
    const verifyToken = jwt.verify(token, keys.jwt.secret);
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