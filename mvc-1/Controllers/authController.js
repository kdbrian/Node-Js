const {promisify}=require('util');
const jwt=require('jsonwebtoken');
const User=require('./../models/user');
const catchAsync=require('./../utils/catchAsync');
const appError=require('./../utils/appError');
const bcrypt=require('bcryptjs');
const sendEmail=require('./../utils/email');
const crypto=require('crypto');

// function to generate the token
const signToken=id=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRES_IN})
}

const createSendToken=(user,statusCode,res)=>{

    const token=signToken(user._id);
    
    // sending the token in a cookie
    const cookieOpt={
        // converting the expiry time to milliseconds and setting it
        expires:new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 3600 * 1000),
        secure:true ,
        httpOnly:true
    };
    
    // removing https in production environment
    if(process.env.NODE_ENV === 'development') cookieOpt.secure=false;

    res.cookie('jwt',token,cookieOpt);

    // avoid sending the password to the user
    user.password=undefined;

    res.status(statusCode).json({
        status:'success',
        token,
        data:{
            user
        }
    })
}

exports.signup=catchAsync(
    async(req,res,next)=>{
        const newUser= await User.create(req.body);

        createSendToken(newUser,201,res);
});

/**function to verify the input password and user password in db
 * @param stringtocompare
 * @param hash
 * @return{* boolean}
 * */ 
//1st param input password //2nd param is the hash
    async function verifyPassword (candidatePassword,userPassword){
        return await bcrypt.compare(candidatePassword,userPassword);
    }

// users will ony require email and password to login
exports.login= catchAsync(async (req,res,next)=>{
    const {email, password}=req.body;

    // 1. check if email and password exists or  has been set

    if(!email || !password){
        // creating an error to be send to the user
       return next( new appError('Please fill all fields',400));
    }

    // 2.check if user exists and credentials match
    const user= await User.findOne({email}).select('+password');
    // console.log(user);
    
    // using a instance methods to verify the password
    if(!user || !(await verifyPassword(password,user.password))){
        return next(new appError('Invalid email or password',401));
    }//bad request

    // 3.If everything is ok send token to client
 
    createSendToken(user,200,res);

    
})

/**Function to protect routes by first checking that the user is logged in */
exports.protect=catchAsync(async (req,res,next)=>{
    /**1.Getting the token or check if exists*/
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){

        token=req.headers.authorization.split(' ')[1];
    }

    // checking if there exists a token
    if(!token){
        return next(new appError('user not logged in🤔',401));//unauthorised
    }

    /**2.token verification
     * jwt.verify(token,process.env.JWT_SECRET)
     * promisifying the function
    */
    const decodedPayload= await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    // console.log(decodedPayload);

    /**3.check if user still exists*/
    const tempUser=await User.findById(decodedPayload.id);
    if(!tempUser){
        return next(new appError('Invalid User',401));//if no user from the decodd id is found
    }

    // 4.check if user changed password after the token was issued

    // using a instance method function
    if(tempUser.changedPasswordAfterTokenIssued(decodedPayload.iat))
        return next(new appError('password was changed recently please login again',401));

    /**Grant access to protected route */
    req.user=tempUser;
    next();
})

/**Function to restrict the user roles
 * admins and users
 */
exports.restrictTo=(...roles)=>{//passing roles as parameters
    return (req,res,next)=>{
        // an array of roles is passed ['admin','lead-guide']and we need to check if the user is in the array
        if(!roles.includes(req.user.role)){
            return next(new appError('You dont have permission',403));
        }

        next();
    }
}

exports.forgotPassword= catchAsync(async (req,res,next)=>{

    // 1. Get user based on posted email
    const user=await User.findOne({email : req.body.email});

    if(!user){
        return next(new appError('no user with that email exists',404));
    }

    // 2. Generate random reset token

    const resetToken=user.createPasswordResetToken();

    await user.save({validateBeforeSave:false});

    // 3. Send it to users email
    // creating a url
    const resetUrl=`${req.protocol}//:${req.get('host')}/api/users/reset-password/${resetToken}`;

    // the message that the user will recieve
    const message=`Forgot password ? Submit new password and confirm password to : ${resetUrl}\n
                   If you didnt request for password reset please ignore this email`;

    // sending the email

    try{
        await sendEmail({
            email:user.email,
            subject:'Reset password Token valid for 10 minutes',
            message
        })

        createSendToken(user,200,res);
    }catch(err){

        // console.log(err);

        // incase  there was an error reset the token and the expire time
        user.passwordResetToken=undefined;
        user.resetTokenExpire=undefined;
        await user.save({validateBeforeSave:false});

        return next(new appError("There was an error sending the email try again later",500));
    }
   
})

exports.resetPassword=catchAsync(
    async(req,res,next)=>{

    //1. get user based on token
        const hashedToken=crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user= await User.findOne({passwordResetToken:hashedToken,resetTokenExpire:{$gt:Date.now()}})

    //2. set new password if(!tokenexpired && user)
    if(!user){
        return next(new appError('Invalid or expired token',400));
    }

    user.password=req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;

    // delete the token/token expiry from the db
    user.passwordResetToken=undefined
    user.resetTokenExpire=undefined

    // save the doc
    await user.save();

    // 3.update the change password property

    // 4.login the user(send token to user)
    // const token=signToken(user._id);
    createSendToken(user,200,res);

})

// password change functionality for the user
exports.updatePassword=catchAsync(async (req,res,next)=>{

    const {currentPassword,newPassword,newPasswordConfirm} = req.body

    const user= await User.findById(req.user._id).select('+password');

    if(!(await user.verifyPassword(currentPassword,user.password))){
        return next(new appError('your current password is wrong',401));
    }

    user.password=newPassword;
    user.passwordConfirm=newPasswordConfirm;

    await user.save();

        createSendToken(user,200,res);
})