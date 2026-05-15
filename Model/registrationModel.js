import db from "mongoose";

const registerSchema = new db.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
  },
},
 {
    timestamps:true
  });

export default db.model("User",registerSchema,"Users");