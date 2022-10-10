const express=require('express');
const studentController=require('./../controllers/student')
const Router=express.Router();
const libraryController=require('./../controllers/library');
const protectRoute=require('./../utils/protect');
const logout=require('./../utils/logout');

//!rendering the pages 
// Router.get('/')
// const loadviews=require('./../controllers/loadviews');

//! account routes


Router.post('/register',studentController.register);
Router.post('/login',studentController.login);
Router.get('/logout',protectRoute('student'),logout('student'));
Router.post('/forgot-password',studentController.forgotPassword)
Router.post('/reset-password',studentController.resetPassword)

Router.route('/')
      .get(protectRoute('student'),studentController.getStudents)      


//! library routes
Router.route('/library')
      .get(protectRoute('student'),libraryController.getBooks)

module.exports=Router;