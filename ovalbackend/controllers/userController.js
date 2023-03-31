const User = require('../models/user');
const catchAsync = require('../middlewares/catchAsync');
const ErrorHandler = require('../utils/errorHandler');
const { ObjectID } = require('bson');

exports.createUser = catchAsync( async (req,res,next) =>{

    const user = await User.create(req.body);
    res.status(201).json({
        success:true,
        user
    })
})


exports.getUser = catchAsync( async (req,res,next) =>{

    const users = await User.find();


    res.status(201).json({
        success:true,
        Count:users.length,
        data:{
            users
        }
    })

})


exports.getUserById = catchAsync( async (req,res,next) =>{

    const user = await User.findById(req.params.id);


    if(!user) return next(new ErrorHandler(`User with id:${req.params.id} not Found`,404));

    res.status(201).json({
        success:true,
        data:{
            user
        }
    })
    
});

exports.updateUser = catchAsync( async (req,res,next) =>{

    const user= await User.findByIdAndUpdate(req.params.id,req.body,{new : true, runValidators:true});

    res.status(200).json({
        success:true,
        data:{
            user
        }
    })
})

exports.deleteUser = catchAsync( async (req,res,next) =>{

    if(! ObjectID.isValid(req.params.id)) return next(new errorHandler("Invalid Object Id",400));
    

    const user  = await User.findByIdAndDelete(req.params.id);

    if(!user) return next(new ErrorHandler("User not found",404));

    res.status(204).json({
        success:true
    });

})

