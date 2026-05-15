import express from "express";
import db from "mongoose";
import  configDotenv  from "dotenv";
import routes from "./Routes/todoRoutes.js";
import cors from "cors";
import registerRoutes from "./Routes/registrationRoutes.js";

configDotenv.config();

const app=express();
app.use(express.json());
app.use(cors());

const connectDB=async ()=>{
    try{
        await db.connect(process.env.MONGO_URL);
        console.log("Db connected successfully");
    }catch(err){
        console.log("Database connection is failed ",{message:err.message});
    }
}

connectDB();
app.use(routes);
app.use(registerRoutes);


app.listen(process.env.PORT,()=>{
    console.log("Server is running on the port number",process.env.PORT);
})
 
