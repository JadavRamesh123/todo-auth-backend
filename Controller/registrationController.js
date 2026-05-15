import db from "../Model/registrationModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import  configDotenv  from "dotenv";
configDotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { name, email, password} = req.body;

    const passwordregex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    
    if(!passwordregex.test(password)){
        return res.status(400).json({message:"Password must contain uppercase, lowercase, number, special character and be at least 6 characters long",})
    }
    const existingUser = await db.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",user});
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await db.find().select("-password");

    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    let updateData = {
      name,
      email,
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await db.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User updated successfully",
      updatedUser,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await db.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const loginUsers=async (req,res)=>{
   try{
     let {email,password}=req.body;
    let user=await db.findOne({email});
    if(!user){
        return res.status(400).json({message:"email does not exists"});
    }
    let passwordCompare=await bcrypt.compare(password,user.password);
    if(!passwordCompare){
        return res.status(400).json({message:"Invalid Password"});
    }
    const userDetails={
        id:user._id,
        email:user.email,
        name:user.name
    }

    const accessToken=jwt.sign(userDetails,process.env.ACCESS_TOKEN_SECRET,{
      expiresIn:"2m"
    })

    const refreshToken=jwt.sign(userDetails,process.env.REFRESH_TOKEN_SECRET,{
      expiresIn:"10d"
    })
   
    let userResponse={
        id:user._id,
        email:user.email,
        name:user.name
    }
    res.status(200).json({message:"User LoggedIn successfully",user:userResponse,accessToken,refreshToken});
   }catch(err){
    res.status(500).json({message:err.message});
   }
}

export const refreshToken = async (req, res) => {

  try {

    let { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh Token is required"
      });
    }

    const decode = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await db.findById(decode.id);

    if (!user) {
      return res.status(404).json({
        message: "User Not Found"
      });
    }

    const accesstoken = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m"
      }
    );

    res.status(200).json({
      message: "New access token generated",
      accesstoken
    });

  } catch (err) {

    return res.status(403).json({
      message: "Invalid Refresh Token"
    });

  }

};