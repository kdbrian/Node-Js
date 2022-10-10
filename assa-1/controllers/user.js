const { ObjectID } = require('bson');
const userModel = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const errorObj = require('../utils/errorObj');


exports.createUser =catchAsync(async (req,res,next) => {

    const newUser = await userModel.create(req.body);

    res.status(201).json({
        status:'success',
        newUser
    });

})

exports.getUsers = catchAsync(async (req,res,next)=>{

    const users = await userModel.find({_id:{$ne:req.user._id},isActive:{$ne:false}}).select('-password');
    
    res.status(200).json({
        success:true,
        count:users.length,
        data:{
            users
        }
    });
})

exports.getUserById = catchAsync(async (req,res,next)=>{

    if(! ObjectID.isValid(req.query.id)) return next(new errorObj("Invalid Object Id",400))

    const user = await userModel.findOne({_id:req.query.id}).select('-password');
   
    // the currently loggen in admin cannot get himself by id
    if(user._id.toString() === req.user._id.toString()) return next(new errorObj(`Cannot Access id:${req.query.id} Properties`,401));

    if(!user) return next(new errorObj(`Resource with id:${req.query.id} Not found`,404));
    
    res.status(200).json({
        success:true,
        data:{
            user
        }
    });
})

exports.updateUser = catchAsync(async (req,res,next)=>{

    if(! ObjectID.isValid(req.query.id)) return next(new errorObj("Invalid Object Id",400))

    let user = await userModel.findById(req.query.id);

    if(!user) return next(new errorObj(`Resource with id:${req.query.id} Not found`,404));

    if(user._id.toString() === req.user._id.toString()) return next(new errorObj(`Cannot Access id:${req.query.id} Properties`,401));

    //changing active status
    if(req.body.isActive){
        let value = req.body.isActive;

        if(value === true)
            user.dateDeleted = undefined
        else if(value === false)
            user.dateDeleted = Date.now()
            
            await user.save({validateBeforeSave:false});

    }


    user = await userModel.findByIdAndUpdate(req.query.id,req.body,{new : true, runValidators:true}).select('-password');
    
    res.status(200).json({
        success:true,
        updatedUser:{
            user
        }
    });
})

exports.deleteUser = catchAsync(async (req,res,next)=>{

    if(! ObjectID.isValid(req.query.id)) return next(new errorObj("Invalid Object Id",400))

    let user = await userModel.findById(req.query.id);

    if(!user) return next(new errorObj(`Resource with id:${req.query.id} Not found`,404));

    if(user._id.toString() === req.user._id.toString()) return next(new errorObj(`Cannot Access id:${req.query.id} Properties`,401));
    
    user = await userModel.findByIdAndDelete(req.query.id);
    
    res.status(204).json({
        success:true
    });
});

exports.getDeletedAccounts = catchAsync (async (req,res,next)=>{

    
    let users = await userModel.find({isActive:false}).select('+isActive').select('-password');

    users = users.filter(user => user._id.toString() !== req.user._id.toString());

    res.status(200).json({
        success:true,
        count:users.length,
        data:users
    })
})

