const userModel=require('./../../models/user');
const jwt=require('jsonwebtoken');
const errorObj=require('./../../utils/error');
const {promisify}=require('util');
const crypto=require('crypto');

/***
 * function to create a jsonwebtoken 
 */
const createToken=async (id)=>{
    return await jwt.sign({id},process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXP});
}

/***
 * function to send a response back o the user
 */
const sendResponse=(res,statCode,token,user)=>{
    // const token =
    res.status(statCode).json({
        status:"success",
        token,
        user
    })
};

// login
exports.login=async (req,res,next)=>{

    try {

        const {username,password}=req.body;

        if(!username || !password) return next(new errorObj("please provide all fields",400));
        // if(!password) return next(new errorObj("please provide a password",400));

        // let user;
        //! using the username to login
        const  user = await userModel.findOne({username}).select('+password');

        if( !user || ! await user.verifyPassword(password,user.password) )return next(new errorObj("Invalid details",401));

        const token=await createToken(user._id);

        res.status(200).cookie('jwt',token,{expiresIn:process.env.JWT_EXP * 24 * 60 * 60 * 1000,httpOnly:true}).json({
            status:'success'
        });
        // sendResponse(res,200,token);
        
    } catch (err) {

        return next(err)
        
    }
}

// logout
exports.logout=async (req,res,next)=>{

    try {

        res.cookie('jwt',token,{expiresIn:Date.now(),httpOnly:true});
        sendResponse(res,200);
        
    } catch (err) {

        return next(err)
        
    }
}


// signup
exports.signUp=async (req,res,next)=>{

    try {
        const user= await userModel.create(req.body);

        res.status(200).json({
            status:"success",
            user
        })
        
    } catch (err) {
        
        return next(err);

    }
}

// forgot password
exports.forgotPassword=async (req,res,next)=>{

    try {
            // get user email
        const {email} = req.body;

        if(!email)return next(new errorObj("use your head 🐱‍🚀 🐱‍🚀 ",400));

        // confirm there exists a user with that email

        const user= await userModel.findOne({email});

        if(!user)return next(new errorObj("Invaid email",404));

        // create password reset token

        const resetToken= await user.createResetPasswordToken();

        //send to user and store in db(encrypted)

        const hashedTkn = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.passwordReset={
            pwdResetToken:hashedTkn,
            // reset token valid for 5 minutes
            pwdTokenExpires:Date.now() + 5 * 60 * 1000,
        
            // increase reset password requests -> for tracking
            pwdResetRequests: user.passwordReset.pwdResetRequests+=1
        };

        await user.save({validateBeforeSave:false});

        const msg=`Visit http://localhost:3000/twitter/api/users/reset-password/${resetToken} to reset Password. Url valid for only 10 minutes`;

        sendResponse(res,200,resetToken);

    } catch (err) {

        return next(err);

    }
}
// reset password
exports.resetPassword=async (req,res,next)=>{

    try{
        //get the token from the params
        const {token}=req.params;

        // get the password and passwordConfirm from the body
        const {password,passwordConfirm} = req.body;

        const hashedTkn= crypto.createHash('sha256').update(token).digest('hex');

        // check if a user with that token exists and token is not expired

        const user = await userModel.findOne({"passwordReset[pwdResetToken]":token}).select('+password');

        // console.log(user.passwordReset.pwdResetToken);

        if(!user)return next(new errorObj("Token expired",404));

        // delete the temporary fields from the database
        user.passwordReset={
            pwdResetToken:undefined,
            
            // change password changedAt
            passwordChangedAt:Date.now(),
            pwdTokenExpires:undefined,
            pwdResetRequests:undefined
        }
        // change respective password
        user.password = password;
        user.passwordConfirm = passwordConfirm;

        //save the password
        await user.save();

        // send a response to the user
        sendResponse(res,200);

    }catch(err){

        return next(err);

    }
}

// two factor authentication
exports.TWOFACTORAUTH=async (req,res,next)=>{
}
// change password
exports.changePassword=async (req,res,next)=>{
}
// delete account
exports.deleteAccount=async (req,res,next)=>{
}
