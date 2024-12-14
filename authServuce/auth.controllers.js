import ApiError from "../shared/apiError.js";
import httpStatusCodes from "../shared/httpstatuscodes.js";
import AuthServices from "./auth.services.js";

class AuthControllers {

  // @desc    Register user
  // @route   POST /api/v1/auth/register
  // @access  Public
  static async registerUserController(req, res, next){
    const {name, email, username, password} = req.body;
    if(!name || !email || !username || !password){
      return next(new ApiError("Please fill all fields (name, email, username and password)", httpStatusCodes.UNPROCESSABLE_ENTITY, true));
    }
    try {
      const newUser = await AuthServices.registerUser(name, email, username, password);
      res.status(httpStatusCodes.RESOURCE_CREATED).json(`User ${newUser} created`);
    } catch (err) {
      if(err instanceof ApiError){
        return next(err);
      }
    }
  }

  // @desc    Login user
  // @route   POST /api/v1/auth/login
  // @access  Public
  static async loginUserController(req, res, next){
    const {username, password} = req.body;
    if(!username || !password){
      return next(new ApiError("Please fill all fields ( username and password )"));
    }
    try {
      const loggedIn = await AuthServices.loginUser(username, password);
      res.status(httpStatusCodes.OK).json(loggedIn);
    } catch (err) {
      if(err instanceof ApiError){
        return next(err);
      }
    }
  }

  // @desc    User profile
  // @route   GET /api/v1/auth/profile
  // @access  Private
  static async getUserProfileController(req, res, next){
    const userId = req.user.id;
    try {
      const userProfile = await AuthServices.userProfile(userId);
      res.status(httpStatusCodes.OK).json(userProfile);
    } catch (err) {
      if(err instanceof ApiError){
        return next(err);
      }
    } 
  }

  // @desc    Update user info
  // @route   PUT /api/v1/auth/profile
  // @access  Private
  static async updateUserinfoController(req, res, next){
    const userId = req.user.id;
    if(!req.body || Object.keys(req.body).length === 0){
      return next(new ApiError("please add new data to update", httpStatusCodes.UNPROCESSABLE_ENTITY, true));
    }
    const newUserData = req.body;
    try {
      const updated = await AuthServices.updateUserInfo(userId, newUserData);
      res.status(httpStatusCodes.OK).json(updated);
    } catch (err) {
      if(err instanceof ApiError){
        return next(err);
      }
    }
  }

  // @desc    Delete User profile
  // @route   DELETE /api/v1/auth/profile
  // @access  Private
  static async deleteUserProfileController(req, res, next){
    const userId = req.user.id;
    try {
      const userDeleted = await AuthServices.deleteUser(userId);
      res.status(httpStatusCodes.OK).json(userDeleted);
    } catch (err) {
      if(err instanceof ApiError){
        return next(err);
      }
    }
  }

  // @desc    Upload user profile image
  // @route   POST /api/v1/auth/upload
  // @access  Private
  static async uploadProfileImageController(req, res, next){
    const userId = req.user.id;
    const image = req.file;
    console.log(userId);
    try {
      const imageSaved = await AuthServices.userProfileImage(image.path, userId);
      res.status(httpStatusCodes.OK).json(imageSaved);
    } catch (err) {
      if(err instanceof ApiError){
        return next(err);
      }
    }
  }

  // @desc    User logout
  // @route   POST /api/v1/auth/logout
  // @access  Private
  static async logoutUserController(req, res, next){
    const token = req.headers["authorization"]?.split(" ")[1];
    if(!token){
      return next(new ApiError("not autherized, no token, please login", httpStatusCodes.FORBIDDEN, true));
    }
    
    try {
      const expiredToken = await AuthServices.logoutUser(token);
      res.status(httpStatusCodes.OK).json(expiredToken);
    } catch (err) {
      if(err instanceof ApiError){
        return next(err);
      }
    }
  }
}

export default AuthControllers