import { userAuthenticationModel } from "../models/userAuthentication.model.js";
import ApplicationError from "../utils/applicationErrors.js";

const checkAdminRole = async (req, res, next) => {
  try {
    const user = await userAuthenticationModel.findById(req.userId);
    if (!user) {
      throw new ApplicationError("No user found", 404);
    }

    if (user?.role !== "ADMIN") {
      throw new ApplicationError(
        "Access forbidden, administrative access required",
        402
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default checkAdminRole;
