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

// update the user email
//?acquire token
Router.get('/profile/update/email',protect,authController.updateUserEmail);
//?Change email with token as parameter
Router.patch('/profile/update/email',protect,authController.updateEmail);

// updating the user password
Router.post('/profile/update-password',protect,authController.changePassword);


Router.get('/forgot-password',authController.forgotPassword);
Router.post('/reset-password/:token',authController.resetPassword);
      
module.exports = Router;