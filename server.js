import express from "express";
import dotenv from "dotenv";

import logger from "./middlewares/logger.js";
import routeNotFound from "./middlewares/routeNotFound.js";
import appErrorHandler from "./middlewares/appErrorHandler.js";
import { connectToDatabase } from "./config/db.config.js";

import urlsRoutes from "./urlsService/urls.routes.js";
import authRoutes from "./authServuce/auth.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8001;

async function startApp() {
  try {
    await connectToDatabase(); // Test database connection

    app.use(express.urlencoded({extended: true})) // Express form data parser
    app.use(logger); // Custome logging middleware

    app.use("/api/v1/urls", urlsRoutes); // Urls routes
    app.use("/api/v1/auth", authRoutes); // Auth routes

    app.use(routeNotFound) // Routes not found middleware 
    app.use(appErrorHandler) // App global error middleware

    app.listen(PORT, ()=>{
      console.log(`==> Server started on port: ${PORT}`);
    })
  } catch (err) {
    console.log("==> Failed to start app", err);
    process.exit(1);
  }
}

startApp();
