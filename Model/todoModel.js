import db from "mongoose";

const todoSchema=new db.Schema({
    text:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:["pending","success","failed"],
        default:"pending",
        required:true,
    },
    user:{
        type:db.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
});

export default db.model("todo",todoSchema,"todos");