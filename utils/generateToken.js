import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const generateToken = (user) => {
  const payload = {id: user._id, username: user.username};
  const token = jwt.sign(
    payload, process.env.JWT_SECRET,
    {expiresIn: "1h", subject: "accessToen"});
  return token;
}

export default generateToken;