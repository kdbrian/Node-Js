const jwt =require('jsonwebtoken');
const userModel = require('../models/user');
const errorObj = require('./errorObj');
const catchAsync = require('./catchAsync')

exports.protect = catchAsync(async (req,res,next)=>{

    const {token} = req.cookies;

    if(!token) return next(new errorObj("User not Logged in.",401));

    const payLoad = jwt.verify(token,process.env.JWT_SECRET);

    const user = await userModel.findById(payLoad.id);

    if(!user) return next(new errorObj("Please Login with a valid account.",401));

    req.user = user
    next();
});

exports.restrictTo = (...roles) =>{
    
    return (async (req,res,next)=>{
        
        if(!roles.includes(req.user.role))
            return next(new errorObj("You are not authorised to perform that action",401));

        next();
    })
}
