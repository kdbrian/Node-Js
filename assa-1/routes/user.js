const express = require('express');
const userController = require('../controllers/user');
const Router = express();
const {protect,restrictTo} = require('../utils/protect');

Router.route('/')
    .get(protect,restrictTo('admin'),userController.getUsers)
    .post(protect,restrictTo('admin'),userController.createUser)

Router.route('/id')
    .get(protect,restrictTo('admin'),userController.getUserById)
    .patch(protect,restrictTo('admin'),userController.updateUser)
    .delete(protect,restrictTo('admin'),userController.deleteUser)

Router.route('/deleted')
    .get(protect,restrictTo('admin'),userController.getDeletedAccounts)
    .patch(protect,restrictTo('admin'),userController.updateUser)
    .delete(protect,restrictTo('admin'),userController.deleteUser)
    
module.exports = Router;