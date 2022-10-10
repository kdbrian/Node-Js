const express = require('express');
const authController = require('../controllers/authController');

const { protect } = require('../utils/protect');
const Router = express();

//! user not loggged in
Router.route('/register')
    .post(authController.register)

Router.route('/login')
    .post(authController.login)

//! user loggged in
Router.route('/logout')
    .get(protect,authController.logout)

Router.route('/profile')
    .get(protect,authController.currentUserProfile)
    .patch(protect,authController.updateUser)

Router.route('/profile/change-password')
    .patch(protect,authController.changePassword)

//? upload profile picture functionality

//! user not loggged in
Router.route('/forgot-password')
    .post(authController.forgotPassword)

Router.route('/reset-password/:token')
    .post(authController.resetPassword)

//? Danger zone
Router.route('/profile/delete')
    .delete(protect,authController.deleteAccount)

module.exports = Router;