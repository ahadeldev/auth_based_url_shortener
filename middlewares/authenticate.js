import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import ApiError from "../shared/apiError.js";
import httpStatusCodes from "../shared/httpstatuscodes.js";
import { checkToken } from "../utils/invalidateToken.js";

dotenv.config();
const authenticate = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if(!token){
    return next(new ApiError("not autherized, no token, please login", httpStatusCodes.FORBIDDEN, true));
  }

  const loggedOutToken = await checkToken(token);
  if(loggedOutToken){
    return next(new ApiError("loggedout token, please login", httpStatusCodes.FORBIDDEN, true));
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    if(err.name === "TokenExpiredError"){
      return next(new ApiError("token has expired, please login", httpStatusCodes.BAD_REQUSEST, true));
    } else {
      return next(new ApiError("invalid token, please login", httpStatusCodes.BAD_REQUSEST));
    }
  }
}

export default authenticate;