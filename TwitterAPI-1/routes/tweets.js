const express=require('express');
const controller=require('./../controllers/tweets/controller');

const Router =express.Router();


Router.route('/')
      .get(controller.getTweet)
      .post(controller.createTweet);

Router.route('/:id')
      .get(controller.getTweetById)
      .delete(controller.deleteTweet)
      .patch(controller.updateTweet);


module.exports = Router;