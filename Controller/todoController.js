import db from "../Model/todoModel.js";

export const createTodo = async (req, res) => {
  try {
    if(!req.user||!req.user._id){
      return res.status(401).json({message:"Unauthorized"});
    }
    let { text, status } = req.body;
     
    if(!text||text.trim()===""){
      return res.status(400).json({message:"Todo is required"});
    }
  
    text=text.trim();

    const allowedStatus=["pending","success","failed"];

    if(status&&!allowedStatus.includes(status)){
      return res.status(400).json({message:"Invalid Status"});
    }

    let data = await db.create({ text, status ,user:req.user._id});

    return res.status(201).json({ message: "Todo Created Successfully", data });
  } catch (err) {
     return res.status(500).json({ message: err.message });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    let { text, status } = req.body;

    const allowedStatus = ["pending", "success", "failed"];

    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid Status",
      });
    }

    const updatedTodo = await db.findOneAndUpdate(
       {
        _id: id,
        user: req.user._id,
      },
      {
        text,
        status,
      },
      {
        new: true,
      }
    );

    if (!updatedTodo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    return res.status(200).json({
      message: "Todo updated successfully",
      updatedTodo,
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTodo = await db.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!deletedTodo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    return res.status(200).json({
      message: "Todo deleted successfully",
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getTodos = async (req, res) => {
  try {

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const todos = await db.find({
      user: req.user._id,
    });

    return res.status(200).json({
      message: "Todos fetched successfully",
      todos
    });

  } catch (err) {

    return res.status(500).json({
      message: err.message,
    });

  }
};
