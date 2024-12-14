import express from "express";
import AuthControllers from "./auth.controllers.js";
import authenticate from "../middlewares/authenticate.js";
import imageUploader from "../config/multer.config.js";

const router = express.Router();

// Register user route
router.post("/register", AuthControllers.registerUserController);

// login user route
router.post("/login", AuthControllers.loginUserController);

// User profile route
router.get("/profile", authenticate, AuthControllers.getUserProfileController);

// Update user details route
router.put("/profile", authenticate, AuthControllers.updateUserinfoController);

// Delete user Profile
router.delete("/profile", authenticate, AuthControllers.deleteUserProfileController);

// User profile image upload route
router.post("/upload", authenticate, imageUploader.single("profile_image"), AuthControllers.uploadProfileImageController);

// Logout user route
router.post("/logout", authenticate, AuthControllers.logoutUserController);

export default router;