import express from "express";
import UrlsControllers from "./urls.controllers.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

// Create new url route
router.post("/", authenticate, UrlsControllers.createUrlController);

// Get all urls route
router.get("/", authenticate, UrlsControllers.getAllUrlsController);

// Get url bu id route
router.get("/:id", authenticate, UrlsControllers.getUrlByIdController);

// Update url by id route
router.put("/:id", authenticate, UrlsControllers.updateUrlByIdController);

// Delete url by id route
router.delete("/:id", authenticate, UrlsControllers.deleteUrlByIdController);

// Redirect url route
router.get("/r/:slug", authenticate, UrlsControllers.redirectUrlController);

export default router;