const express = require('express');
const userController = require('../controllers/userController');


const {restrictTo, protect} = require('../middlewares/protect');


const Router = express.Router();


Router.route('/')
      .get(protect,restrictTo('admin'),userController.getUser)

Router.route('/new')
      .post(protect,restrictTo('admin'),userController.createUser)

Router.route('/:id')
      .get(protect,restrictTo('admin'),userController.getUserById)
      .patch(protect,restrictTo('admin'),userController.updateUser)
      .delete(protect,restrictTo('admin'),userController.deleteUser)
      


module.exports = Router;
