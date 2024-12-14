import { getCollection } from "../config/db.config.js";
import { ObjectId } from "mongodb";
import fs from "fs";
import path from "path";
import ApiError from "../shared/apiError.js";
import httpStatusCodes from "../shared/httpstatuscodes.js";
import hashPassword from "../utils/hashPassword.js";
import checkPassword from "../utils/checkPassword.js";
import generateToken from "../utils/generateToken.js";
import { invalidateToken } from "../utils/invalidateToken.js";

class AuthServices {

  // Register new user handler
  static async registerUser(name, email, username, password){
    const usersCollection = getCollection("users");
    const emailFound = await usersCollection.findOne({email: email});
    const usernameFound = await usersCollection.findOne({username: username});
    if(emailFound){
      throw new ApiError("Invalid email or username", httpStatusCodes.CONFILCT, true);
    } else if (usernameFound){
      throw new ApiError("Invalid email or username", httpStatusCodes.CONFILCT, true);
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await usersCollection.insertOne({
      name: name,
      email: email,
      username: username,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    if(!newUser){
      throw new ApiError("Error creating user", httpStatusCodes.INTERNAL_SERVER_ERROR, false);
    }

    return newUser.insertedId;
  }

  // Login user handler
  static async loginUser(username, password){
    const usersCollection = getCollection("users");
    
    // Check if username exists
    const userExists = await usersCollection.findOne({username: username})
    if(!userExists){
      throw new ApiError("user not found", httpStatusCodes.NOT_FOUND, true);
    }

    // Check if password correct
    const correctPassword = await checkPassword(password, userExists.password);
    if(!correctPassword){
      throw new ApiError("wrong password", httpStatusCodes.UNPROCESSABLE_ENTITY, true);
    }

    // Token generation
    const token = generateToken(userExists);
    
    const user = {
      id: userExists._id,
      name: userExists.name,
      username: userExists.username,
      email: userExists.email,
      accessToken: token,
    }
    return user;
  }

  // User profile handler
  static async userProfile(id){
    const usersCollection = getCollection("users");
    const profile = await usersCollection.findOne({_id: new ObjectId(id)});
    if(!profile){
      throw new ApiError("profile not found", httpStatusCodes.NOT_FOUND, true);
    }
    return profile;
  }

  // Update user info handler
  static async updateUserInfo(userId, newUserData){
    const usersCollection = getCollection("users");
    const userFound = await usersCollection.findOne({_id: new ObjectId(userId)});
    if(!userFound){
      throw new ApiError("profile not found", httpStatusCodes.NOT_FOUND, true);
    }

    const newHashedPassword = newUserData.password ? await hashPassword(newUserData.password) : userFound.password;
    const newName = newUserData.name || userFound.name;
    const newEmail = newUserData.email || userFound.email;
    const newUsername = newUserData.username || userFound.username;
    const newPassword = newHashedPassword;

    const updatedUser = await usersCollection.updateOne(
      {_id: new ObjectId(userId)},
      {$set: {
        name: newName,
        email: newEmail,
        username: newUsername,
        password: newPassword,
        updated_at: new Date()}
      }
    );
    if(updatedUser.modifiedCount !== 1){
      throw new ApiError("Error updating user profile", httpStatusCodes.INTERNAL_SERVER_ERROR, false);
    }

    return `${userId} profile updated`;
  }

  // Delete user profile
  static async deleteUser(userId){
    const usersCollection = getCollection("users");
    const urlsCollection = getCollection("urls");

    const deleteUser = await usersCollection.deleteOne({_id: new ObjectId(userId)});
    await urlsCollection.deleteMany({user_id: userId});

    if (deleteUser.matchedCount === 0) {
      throw new ApiError("no matching user found", httpStatusCodes.NOT_FOUND, false);
    }

    if(deleteUser.deletedCount !== 1){
      throw new ApiError("Error deleting user", httpStatusCodes.INTERNAL_SERVER_ERROR, false);
    }

    // handle user deletion folder
    const __dirname = path.resolve();
    const userDir = path.join(__dirname, "uploads", "profile_images", userId);
    try {
      fs.rm(userDir, { recursive: true, force: true }, (err) => {
        if (err) {
          throw new ApiError(`error deleting folder for user ${userId}`, httpStatusCodes.INTERNAL_SERVER_ERROR, false);
        }
      });
    } catch (err) {
      throw new ApiError(`Error during folder deletion for user ${userId}`, httpStatusCodes.INTERNAL_SERVER_ERROR, false);
    }

    return `${userId} profile, urls and folder deleted`;
  }

  // Add user profile image handler
  static async userProfileImage(imagePath, userId){
    const usersCollection = getCollection("users");
    const addImage = await usersCollection.updateOne(
      {_id: new ObjectId(userId)},
      {$set: { profile_image: imagePath, created_at: new Date(), updated_at: new Date() }}
    );
    
    if (addImage.matchedCount === 0) {
      throw new ApiError("user not found", httpStatusCodes.NOT_FOUND, false);
    }

    if(addImage.modifiedCount !== 1){
      throw new ApiError("Error adding user image", httpStatusCodes.INTERNAL_SERVER_ERROR, false);
    }

    return addImage.modifiedCount === 1 ? `${userId} image added` : "";
  }

  // User logout handler
  static async logoutUser(token){
    const loggedOutToken = await invalidateToken(token);
    if(!loggedOutToken){
      throw new ApiError("error logging out, please try again", httpStatusCodes.INTERNAL_SERVER_ERROR, false);
    }
    return loggedOutToken;
  }

  
}

export default AuthServices;