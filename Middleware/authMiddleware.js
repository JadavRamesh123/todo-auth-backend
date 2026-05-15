import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../Model/registrationModel.js";

dotenv.config();

export const authMiddleware = async (req,res,next) =>{
  
  try {
    const authHeader =req.headers.authorization;
    if (!authHeader ||!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token Not Found",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log(token);

    const decode = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(
      decode.id
    ).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;

    console.log(decode);

    next();

  } catch (err) {

    return res.status(401).json({
      message: err.message,
    });

  }
};

