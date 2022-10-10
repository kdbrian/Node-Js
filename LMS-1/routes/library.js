const express = require('express')
const Router=express.Router();
const controller=require('./../controllers/library');

Router.route('/')
      .get(controller.getBooks)
      .post(controller.createBook)

Router.route('/:id')
     .get(controller.getBookById)
     .patch(controller.updateBook)
     .delete(controller.deleteBook)

module.exports=Router;
