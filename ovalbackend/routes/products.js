const express = require('express');

const Router = express.Router();
const {protect, restrictTo} = require('../middlewares/protect');

//! from controller file
const { getProduct, newProduct, getProductById, updateProduct, deleteProduct, createProductReview, getProductReviews, deleteProductReview } = require('./../controllers/products');

Router.route('/')
     .get(getProduct)   

Router.route('/new')
      .post(protect,restrictTo('admin'),newProduct)

//? reviewing or updationg a review on a product
Router.patch('/review',protect,createProductReview)

//? getting all the reviews of a product
Router.get('/reviews',protect,getProductReviews)
Router.delete('/reviews',protect,deleteProductReview)

Router.route('/:id')
      .get(getProductById)
      .patch(protect,restrictTo('admin'),updateProduct)
      .delete(protect,restrictTo('admin'),deleteProduct)


module.exports= Router;
