import { getCollection } from "../config/db.config.js";
import ApiError from "../shared/apiError.js";
import httpStatusCodes from "../shared/httpstatuscodes.js";

// Adding the token to the loggedout tokens collection for validating later
const invalidateToken = async (token) => {
  const tokensCollection = getCollection("logout_tokens");
  const inserted = await tokensCollection.insertOne({
    expiredToken: token,
    created_at: new Date(),
  });
  if(!inserted){
    throw new ApiError("error logging out, please try again", httpStatusCodes.INTERNAL_SERVER_ERROR, false);
  }

  return inserted.insertedId;
}

// Validating the token, check if it is in the database
const checkToken = async (token) => {
  const tokensCollection = getCollection("logout_tokens");
  const tokenFound = await tokensCollection.findOne({expiredToken: token});
  return tokenFound;
}

export { invalidateToken, checkToken };