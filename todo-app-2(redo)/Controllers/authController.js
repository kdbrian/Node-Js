/**
 * Handles all the authorization activities
 */
const userModel=require('./../models/user');
const jwt=require('jsonwebtoken');
const catchAsync=require('./../utils/catchAsync');
const appError=require('./../utils/appError');
const bcrypt=require('bcryptjs');
const {promisify}=require('util');
const crypto=require('crypto');
const sendEmail=require('./../utils/email');

// will encode the user id into the jwt payload
const signToken= function (id) {
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRES});
}
/**function to verify the user password against the input password */
function verifyPassword(password,userPassword) {
    return bcrypt.compare(password,userPassword);
}

// Sign up activity
exports.signup=catchAsync(async (req,res,next)=>{
        const user= await userModel.create(req.body);
        res.status(200).json({
            status:"user created successfully",
            token:signToken(user._id),
            data:{
                user
            }
        });
})


exports.login=catchAsync( async (req,res,next)=>{
    //will login using email and password
    const {email,password} = req.body
    // 1. check if email and password is set
    if(!email || !password) return next(new appError('all fields are required',401));

    // locate the user in DB using the email and verify password
    const user=await userModel.findOne({email}).select('+password');
    
    if(!user || ! await verifyPassword(password,user.password)) return next(new appError('Invalid email or password',401));

    // at this point the user details are ok
    res.status(200).json({
        status:"login successfully",
        token:signToken(user._id)
    });

});


// protecting the routes to logged in users
exports.protect=catchAsync( async (req,res,next)=>{
    // check if the authorization(Bearer) field is set
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){

        // get the authorization token from the headers
        token=req.headers.authorization.split(' ')[1];
    }

    if(!token)return next(new appError('Log in please 🙄',401));

    // token verification
    const payLoad= await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    
    
    // get the user with the id from the token
    const user=await userModel.findById(payLoad.id);
    if(!user)return next(new appError('User doesn\'t exist..😫',401));

    req.user=user;
    next();
})

// user roles
/**Restrict certain routes to certain users */
exports.restrictTo=(...roles)=>{
    // get the user
    
    return(req,res,next)=>{
        
    const user=req.user;

    // check if his role is in the roles array

    if(!roles.includes(user.role))return next(new appError('You are not allowed to perform this action ...😥😂😂',401));

    next();
    }
   
}

// forgot password functionality
exports.forgotPassword=catchAsync(async (req,res,next)=>{

    // get the email from the request
    const {email }=req.body;
    if(!email){
        return next(new appError('Please provide a valid email',404));
    }

    // get user with that email
    const user=await userModel.findOne({email});

    if(!user){
        return next(new appError('User doesn\'t exist..😫',401));
    }

    // create a token and store in db

    const token=await user.createPasswordReset();
    
    // console.log(token);

    await user.save({validateBeforeSave:false});

    // send the user a hashed token via email
    // creating a formattexd url to send to the user email
    const resetUrl=`${req.protocol}://${req.get('host')}/api/v2/users/${token}`;

    const message=` Forgot password reset as requested by ${user.email}. ${resetUrl}. If you didn't request please consider securing your account by changing the password`;

    
    try{
        // send email to user

        await sendEmail({
            to:user.email,
            subject:"Reset password valid for 10 minutes",
            message
        });
        // return a response

        res.status(200).json({
            status:"success",
            message:"email end successfully"
        });
    }catch(err){

        // incase  there was an error reset the token and the expire time
        user.passwordResetToken=undefined;
        user.resetTokenExpire=undefined;
        await user.save({validateBeforeSave:false});

        return next(new appError("There was an error sending the email try again later",500));
    }

    

})

exports.resetPassword=catchAsync( async (req,res,next)=>{
    
    // user will post a new passsword and a password confirm field
    const {password,passwordConfirm}=req.body;

    // get the token from the url

    const hashedToken=crypto.createHash('sha256').update(req.params.token).digest('hex');

    // verify the token with the one in the database and fetch the bearer
    
    const user = await userModel.findOne({passwordResetToken:hashedToken,resetTokenExpire:{$gt:Date.now()}})

    if(!user){return next(new appError('Invalid or expired token',401));}

    // save new password
    user.password=password;
    user.passwordConfirm=passwordConfirm;

    // delete the reset token and its expiry date
    user.passwordResetToken=undefined;
    user.resetTokenExpires=undefined;

    await user.save();

    // return a respone

    res.status(200).json({
        status:"success",
        message:"password changed successfully"
    })
});

// function to change user password
exports.changePassword=catchAsync(async (req,res,next)=>{
    
    // check if fields are set
    const {currentPassword,password,passwordConfirm}=req.body;

    if(!currentPassword || !password || !passwordConfirm) return next(new appError('fill all fields',404));
    
    // get the user from the db

    const user=await userModel.findOne({email:req.user.email}).select('+password');

    if(!user)return next(new appError('no user found consider logging in again',401));

    // confirm current pasword with the one in the db
    if(! await verifyPassword(currentPassword,user.password))return next(new appError('wrong input for current password field'));

    // change the password
    user.password=password;
    user.passwordConfirm=passwordConfirm

    // save changes to the database
    await user.save();

    // change password changed at

    user.passwordChangedAt= Date.now()+1000
    // send a response and a token
    res.status(200).json({
        status:'success',
        token:signToken(user._id)
    })
});