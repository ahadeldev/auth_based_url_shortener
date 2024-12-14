import multer from "multer";
import fs from "fs";
import path from "path";
import ApiError from "../shared/apiError.js";
import httpStatusCodes from "../shared/httpstatuscodes.js";

// Get the correct __dirname for ES6 module, it is not available by default as in commonjs
const __dirname = path.resolve();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const userDir = path.join(__dirname, "uploads", "profile_images", req.user.id);

    // Check if the user folder exists, If not create it
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    // Set the callback error to null and return the user storage directory
    cb(null, userDir);
  },

  filename: function(req, file, cb) {
    const userDir = path.join(__dirname, "uploads", "profile_images", req.user.id);

    // Check if a file already exists in the folder and delete it
    fs.readdir(userDir, (err, files) => {
      if (err) return cb(err);

      // Delete the old image if it exists
      files.forEach(file => {
        if (file.startsWith('profile-')) {
          const filePath = path.join(userDir, file);
          fs.unlinkSync(filePath); // Delete the old image
        }
      });

      // Set the new file's name
      cb(null, `profile-${new Date().getTime()}${path.extname(file.originalname)}`);
    });
  }
});

const fileFilter = (req, file, cb) => {
  const imagesFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if(imagesFileTypes.includes(file.mimetype)){
    // Set the error to null and return true as the file uploaded is supported
    cb(null, true);
  } else {
    // Set the error to an ApiError in case the user uploaded unsupported file type
    const err = new ApiError("invalid file type. Only JPEG, PNG, and GIF are allowed", httpStatusCodes.UNSUPPORTED_MEDIA_TYPE, true);
    cb(err);
  }
};

const imageUploader = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Image file hash 5MB size limit
});

export default imageUploader;