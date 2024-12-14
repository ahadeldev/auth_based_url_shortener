import ApiError from "../shared/apiError.js";
import httpStatusCodes from "../shared/httpstatuscodes.js";
import { getCollection } from "../config/db.config.js";
import { nanoid } from "nanoid";
import { ObjectId } from "mongodb";

class UrlsServices {

  // Create new url handler
  static async createUrl(longUrl, description, userId){
    const shortUrl = nanoid(8);
    const urlsCollection = getCollection("urls");
    const newUrl = await urlsCollection.insertOne({
      long_url: longUrl,
      description: description ? description : "",
      short_url: shortUrl,
      user_id: userId,
      fullUrld: `http://localhost:8000/api/v1/urls/r/${shortUrl}`,
      created_at: new Date(),
      updated_at: new Date(),
    });
    
    if(!newUrl){
      throw new ApiError("Error creating url", httpStatusCodes.INTERNAL_SERVER_ERROR, false);
    }

    return `Url created ID: ${newUrl.insertedId}`;
  }

  // Get all urls handler
  static async getAllUrls(userId){
    const urlsCollection = getCollection("urls");
    const allUrls = await urlsCollection.find({user_id: userId}).toArray();
    if(!allUrls){
      throw new ApiError("Error getting urls", httpStatusCodes.INTERNAL_SERVER_ERROR, false);
    }
    
    return allUrls;
  }

  // Get url by id handler
  static async getUrlById(id, userId){
    const urlsCollection = getCollection("urls");
    const url = await urlsCollection.findOne({_id: new ObjectId(id), user_id: userId});
    if(!url){
      throw new ApiError("Url not found", httpStatusCodes.NOT_FOUND, true);
    }
    return url;
  }

  // Update url by id handler
  static async updateUrlById(id, userId, updatedBody){
    const urlsCollection = getCollection("urls");
    const updatedUrl = await urlsCollection.updateOne(
      {_id: new ObjectId(id), user_id: userId},
      {$set: {...updatedBody, updated_at: new Date()}}
    );

    if (updatedUrl.matchedCount === 0) {
      throw new ApiError("No matching URL found", httpStatusCodes.NOT_FOUND, false);
    }

    if(updatedUrl.modifiedCount !== 1){
      throw new ApiError("Error updating url", httpStatusCodes.INTERNAL_SERVER_ERROR, false);
    }
    
    return updatedUrl.modifiedCount === 1 ? `Url ${id} updated` : "";
  }

  // Delete url by id handler
  static async deleteUrlById(id, userId){
    const urlsCollection = getCollection("urls");
    const deletedUrl = await urlsCollection.deleteOne({_id: new ObjectId(id), user_id: userId});
    
    if (deletedUrl.matchedCount === 0) {
      throw new ApiError("No matching URL found", httpStatusCodes.NOT_FOUND, false);
    }
    
    if(deletedUrl.deletedCount !== 1){
      throw new ApiError("Error deleting url", httpStatusCodes.INTERNAL_SERVER_ERROR, false);
    }

    return deletedUrl.deletedCount === 1 ? `Url ${id} deleted` : "";
  }

  // Short url redirction handler
  static async urlRedirect(shortUrl){
    const urlsCollection = getCollection("urls");
    const url = await urlsCollection.findOne({short_url: shortUrl});
    if(!url){
      throw new ApiError("Url not found", httpStatusCodes.NOT_FOUND, true);
    }
    return url;
  }
}

export default UrlsServices;