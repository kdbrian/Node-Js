const catchAsync = require('./CatchAsyncErrors');
const errorHandler = require('./ErrorHandler');
const jwt =require('jsonwebtoken');
const User = require('../models/user');

exports.protect = catchAsync(async (req,res,next) =>{

    // check if user is logged in (authenticated)

    // get token from the cookies

    const token = req.cookies;

    console.log(req.cookies);

    if(!token) return next( new errorHandler("Login to access",401));

    const payLoad = jwt.verify(token,process.env.JWT_SECRET);

    const user = await User.findById(payLoad.id);

    if(!user) return next(new errorHandler("Log in again",401));

    req.user = user
    next();
});

exports.restrictTo = (...roles) =>{ 
    
    return( async (req,res,next) => {
        
        if(!roles.includes(req.user.role)) return next(new errorHandler("You are not authorised to perform this action",403));

        next();
    })

};