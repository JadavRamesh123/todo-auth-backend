import express from 'express';
import { authMiddleware } from '../Middleware/authMiddleware.js';
import { createTodo, deleteTodo, getTodos, updateTodo } from '../Controller/todoController.js';


const todoRoutes=express.Router();

todoRoutes.post("/createTodo",authMiddleware,createTodo);
todoRoutes.patch("/updateTodo/:id",authMiddleware,updateTodo);
todoRoutes.delete("/deleteTodo/:id",authMiddleware,deleteTodo);
todoRoutes.get("/getTodos",authMiddleware,getTodos);

export default todoRoutes;

