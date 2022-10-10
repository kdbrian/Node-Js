const express=require('express');
const controller=require('./../Controllers/todoController');
const authController=require('./../Controllers/authController');

const Router=express.Router();

// user must be loged in to use the todo routes
Router.route('/')
      .get(authController.protect,controller.getTodos)
      .post(authController.protect,controller.createTodo)

Router.route('/:id')
      .get(authController.protect,controller.getTodo)
      .patch(authController.protect,controller.updateTodo)
      .delete(authController.protect,controller.deleteTodo)

module.exports=Router;