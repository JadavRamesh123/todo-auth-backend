import express from "express";
import { deleteUser, getAllUsers, loginUsers, refreshToken, registerUser, updateUser } from "../Controller/registrationController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

const registerRoutes=express.Router();

registerRoutes.post("/register",registerUser);
registerRoutes.post("/loginUser",loginUsers);
registerRoutes.get("/getUsers",authMiddleware,getAllUsers);
registerRoutes.put("/updateUsers/:id",authMiddleware,updateUser);
registerRoutes.delete("/deleteUsers/:id",authMiddleware,deleteUser);
registerRoutes.post("/refreshToken",refreshToken);

export default registerRoutes;