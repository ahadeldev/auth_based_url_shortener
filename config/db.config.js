import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import ApiError from "../shared/apiError.js";
import httpStatusCodes from "../shared/httpstatuscodes.js";
dotenv.config();
const URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const client = new MongoClient(URI);
let database;

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log(`==> Connected to database`);
    database = client.db("urlShortner");
  } catch (err) {
    console.log("Error connecting to database", err);
  }
}

const getCollection = (collectionName) => {
  if(!database){
    throw new ApiError("Database connection not established. Call connectToDatabase first", httpStatusCodes.INTERNAL_SERVER_ERROR, false);
  }
  return database.collection(collectionName);
}

export {connectToDatabase, getCollection};