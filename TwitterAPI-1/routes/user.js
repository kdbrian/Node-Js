const express=require('express');
const userController=require('./../controllers/users/controller');
const authController=require('./../controllers/auth/controller');
const { protect } = require('../utils/protect');


const Router =express.Router();

Router.post('/sign-up',authController.signUp);
Router.post('/login',authController.login);

Router.get('/logout',protect,authController.logout);


// ? user not logged in
Router.post('/forgot-password',authController.forgotPassword);
Router.post('/reset-password/:token',authController.resetPassword);

//? user Logged in
Router.post('/two-factor-authenticate',protect,authController.TWOFACTORAUTH);
Router.patch('/change-password',protect,authController.changePassword);
Router.delete('/delete-account',protect,authController.deleteAccount);

//tweeting routes
Router.post('/tweet',)

Router.route('/')
      .get(protect,userController.getUser)
      .post(protect,userController.createUser)

Router.route('/:id')
      .get(protect,userController.getUserById)
      .delete(protect,userController.deleteUser)
      .patch(protect,userController.updateUser)


module.exports = Router;