const User = require('../models/user');
const errorHandler=require('../utils/errorHandler');
const catchAsync = require('../middlewares/catchAsync');
const sendToken = require('../utils/sendResp');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

exports.register= catchAsync( async (req,res,next) =>{

    // const {name, email, password} = req.body;

    const user= await User.create(req.body);

    sendToken(user,201,res)

 });

exports.login= catchAsync( async (req,res,next) =>{

    const {email, password} = req.body;

    if(!email || !password) return next(new errorHandler("please provide all fields",400));

    const user = await  User.findOne({email}).select('+password');

    if(!user || ! await user.verifyPassword(password)) return next( new errorHandler("Invalid email or password",404));

    sendToken(user,200,res);
});

exports.logout= catchAsync( async (req,res,next) =>{

    res.cookie('token',null,{
        expires: new Date(Date.now()),
        httpOnly:true
    });

    res.status(200).json({
        success:true,
        message:"Logged out successfully"
    })
});

exports.forgotPassword = catchAsync( async (req,res,next) =>{

    const {email} = req.body;

    if(!email) return next( new errorHandler("Please provide an email",400));

    const user = await  User.findOne({email});

    
    if(!user) return next( new errorHandler("No user found",404));

    const resetTkn = user.generateResetToken();

    await user.save({ validateBeforeSave:false });

    // password reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/shop/api/v1/users/reset-password/${resetTkn}`;

    // message to send via email
    const message=`A password reset was requested for your account. Use the following url to reset your password.\n${resetUrl}.\nIf you didn't request for it please consider changing your password`;

    // console.log(message);
    
    try {

        // await sendEmail({
        //     email:user.email,
        //     subject: 'Password reset',
        //     message
        // });


        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email}`,
            message
        });

    } catch (err) {

        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;

        await user.save({ validateBeforeSave:false });

        return next(new errorHandler(err,500));
        
    }
    





})

exports.resetPassword = catchAsync( async (req,res,next) =>{

    const { token } = req.params;

    const {password,passwordConfirm} = req.body;

    if(!password || !passwordConfirm) return next(new errorHandler("Insert all fields",400));


    const hashedTkn = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({resetPasswordToken:hashedTkn, resetPasswordExpiry: {$gt: Date.now() }});


    if(!user )return next(new errorHandler("Invalid or expired reset Token",404));

    
    user.password = password;
    user.passwordConfirm = passwordConfirm;

    user.resetPasswordToken= undefined
    user.resetPasswordExpiry= undefined

    await user.save();

    res.status(200).json({
        success:true,
        message:"Password changed successfully. Login again"
    });
})


// getting details of the currently logged in user
exports.getUserProfile = catchAsync( async (req,res,next) =>{

    // get user from request

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    })
});


exports.changePassword = catchAsync( async (req,res,next) =>{

    const user = await User.findById(req.user.id).select('+password');

    const {oldPassword, password, passwordConfirm} = req.body;

    if(!oldPassword || !password || !passwordConfirm) return next(new errorHandler("Insert all fields",400));
    

    if(! await user.verifyPassword(oldPassword)) return next( new errorHandler("Invalid old user password",401));

    
    user.password = password;
    user.passwordConfirm = passwordConfirm;

    await user.save();

    // logging the user out 
    res.cookie('token',null,{expires: new Date(Date.now()), httpOnly:true}).status(200).json({
        success:true,
        message:"Password changed successfully. Login again"
    });
    
})


exports.updateUserProfile = catchAsync( async (req,res,next) =>{

    if(req.body.password || req.body.passwordConfirm) return next( new errorHandler("Cannot update Password",400));

    // const {name,email} = req.body;

    // get user from db and update

    const user = await User.findByIdAndUpdate(req.user.id,req.body,{new:true, runValidators:true});


    res.status(200).json({
        success:true,
        user
    });
});