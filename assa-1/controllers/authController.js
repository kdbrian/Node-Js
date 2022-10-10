const userModel = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const errorObj = require('../utils/errorObj');
const jwt =require('jsonwebtoken');
const sendEmail = require('../utils/email');
const crypto=require('crypto');

const signToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn: process.env.JWT_SECRET_EXP});
}
exports.register = catchAsync(async (req,res,next)=>{

    const {name,email,password,passwordConfirm} = req.body

    const user = await userModel.create({
        name,email,password,passwordConfirm  
    });

    res.status(201).json({
        status:'success',
        message:'user account successfully created proceed to log in with email and password'
    });

});


exports.login = catchAsync(async (req,res,next)=>{

    const {email,password} = req.body

    const user = await userModel.findOne({email,isActive:{$ne:false}}).select('+password');

    if(!user || ! await user.verifyPassword(password)) return next(new errorObj("Invalid email or password",404));

    res.status(200).cookie('token',signToken(user._id), {httpOnly:true, expires: new Date(Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000) }).json({
        status:'success',
        message:'logged in successfully'
    });

});

//get current logged in user profile
exports.currentUserProfile = catchAsync(async (req,res,next)=>{

    const user = await userModel.findById(req.user._id);

    //redirect to login
    if(!user) return next(new errorObj("User not found.Please login again",404));

    const {name,email} = user;

    res.status(200).json({
        name,
        email
    });
});

//? update user profile name only and maybe profile picture
exports.updateUser = catchAsync(async (req,res,next)=>{

    let user = await userModel.findById(req.user._id);

    if(!user) return next(new errorObj(`User Not found`,404));

    const {name,photo} = req.body;

    user = await userModel.findByIdAndUpdate(req.user._id,{name,photo},{new : true, runValidators:true});

    let newName = user.name;

    // redirect back to profile page with updated details
    res.status(200).json({
        success:true,
        name:newName
    });
});

//?forgot user password 
exports.forgotPassword = catchAsync(
    async (req,res,next)=>{

        const {email} = req.body;


        const user = await userModel.findOne({email,isActive:{$ne:false},canModify:{$ne:false}});

        if(!email || !user ) return next(new errorObj("Invalid email",400));

        const resetToken = await user.createPwdResetToken();

        // send reset token to user email
        const url = `http://localhost:3000/api/v1/user/reset-password/${resetToken}`;

        const msg = `Password reset request.<br/>Use the following url to reset Your password ${url}`
        
        res.status(200).json({
            success:true,
            message:msg
        });
});

//!reset using email /reset-password/:token
exports.resetPassword = catchAsync(async (req,res,next)=>{

    const {token} = req.params
    const {password,passwordConfirm} = req.body

    if(!password || !passwordConfirm) return next(new errorObj("Please provide all fields",400));

    const user = await userModel.findOne({
            passwordResetToken:crypto.createHash('sha256').update(token).digest('hex'),
            resetTokenExpire:{$gte : Date.now()}
        }).select('+password');

    if(!user) return next(new errorObj("Invalid password reset token",400));

    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.passwordChangedAt = Date.now();
    user.pwdChanged='true';
    
    user.passwordResetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.status(201).json({
        success:true,
        message:"Password changed successfully. Please login again"
    });

});

//?change logged in user password
exports.changePassword = catchAsync(async (req,res,next)=>{

    const {oldPassword,password, passwordConfirm} = req.body

    // console.log(req.body);

    if(!oldPassword || !password || !passwordConfirm) return next(new errorObj("Please provide all fields",400));

    const user = await userModel.findById(req.user._id);

    if(!user) return next(new errorObj(`User Account Not found. please contact admin`,404))

    if(! await user.verifyPassword(oldPassword)) return next(new errorObj(`Invalid old user password`,400));

    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.pwdChanged='true';
    user.passwordChangedAt = Date.now();

    await user.save();

    //log the user out --> to login with new password
    res.status(200).cookie('token',null, {httpOnly:true, expires: new Date(Date.now()) }).json({
        status:'success',
        message:'Password changed successfully. Please login again'
    });

});

//? mark the user account as inactive
exports.deleteAccount = catchAsync(async (req,res,next)=>{
    const user = await userModel.findOne({_id:req.user._id});
  
    if(!user) return next(new errorObj(`User Account Not found. please contact admin`,404))
    
    user.isActive = false;
    user.dateDeleted = Date.now();

    await user.save({validateBeforeSave:false});

    res.status(204).cookie('token',null, {httpOnly:true, expires: new Date(Date.now()) }).json({
        status:'success',
        message:'Account deleted successfully'
    });
    
})

exports.logout = catchAsync(async (req,res,next)=>{

    res.status(200).cookie('token',null, {httpOnly:true, expires: new Date(Date.now()) }).json({
        status:'success',
        message:'logged out successfully'
    });

});