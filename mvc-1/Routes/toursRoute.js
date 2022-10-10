const controller =require('./../Controllers/tourController')
const authController=require('./../Controllers/authController');
const express=require('express');
const router=express.Router();

// router.param('body',checkBodyx);

// router to get the five best tours
// using a midle ware to add parameters to the url
router.route('/5-best-tours').get(/**middlware*/controller.aliasTopFiveTours,controller.getTours)


router.route('/tourstats')
      .get(controller.getTourStats)

router.route('/monthly-plan/:year')
      .get(controller.getMonthlyPlan)

router
    .route('/')
    .get(authController.protect,controller.getTours)
    .post(controller.createTour)
    
//all incoming requests with id
router.route('/:id')
      .get(controller.getTourById)
      .delete(authController.protect,authController.restrictTo('admin','lead-guide'),controller.deleteTour)
      .patch(controller.updateTour);

module.exports=router;