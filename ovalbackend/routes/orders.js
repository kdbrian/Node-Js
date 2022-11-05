const express = require('express');
const orderController = require('../controllers/orderController');
const {protect,restrictTo} = require('../middlewares/protect');

const Router = express.Router();

//? creating a new order
Router.route('/new')
      .post(protect,orderController.createOrder)

//? getting all the orders of the logged in user
Router.route('/mine')
      .get(protect,orderController.getUserOrders)

//? getting an order by its id
Router.route('/:id')
      .get(protect,orderController.getOrderById)
      .patch(protect,restrictTo('admin'),orderController.updateOrder)
      .delete(protect,restrictTo('admin'),orderController.deleteOrder)

//! admin routed
Router.route('/')
      .get(protect,restrictTo('admin'),orderController.getOrders)




module.exports = Router;