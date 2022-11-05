const express = require('express');

const Router = express.Router();

const authController = require('../controllers/authController');
const { protect } = require('../middlewares/protect');

Router.post('/register',authController.register);

Router.post('/login',authController.login);
Router.get('/logout',protect,authController.logout);

// getting the user profile
Router.get('/profile',protect,authController.getUserProfile);

// update the user profile
Router.patch('/profile/update',protect,authController.updateUserProfile);

// updating the user password
Router.post('/profile/update-password',protect,authController.changePassword);


Router.post('/forgot-password',authController.forgotPassword);
Router.post('/reset-password/:token',authController.resetPassword);
      
module.exports = Router;