const { isValidObjectId } = require( 'mongoose');
const UserModel = require( '../models/user');
const CatchAsync = require( './../utils/CatchAsyncErrors');
const ErrorObject = require( './../utils/ErrorHandler');
const jwt = require('jsonwebtoken');


exports.login = CatchAsync( async(req, res, next)=>{

    const {username, password} = req.body;

    if(!username || !password)
        return next(new ErrorObject("Please fill all fields", 400));

    const user = await UserModel.findOne({username}).select('+password');

    if (!user || !await user.verifyPassword(password))
        return next(new ErrorObject("Invalid username or password", 401));

    //give token in cookie and return response
    token = user.createJWT();


    res.status(200).cookie('token', token, { 
        expires : new Date( Date.now() + process.env.COOKIE_EXPIRE *  360 * 60 * 1000) ,
        httpOnly:true

    }).json({
        success:true,
        message:"login success",
        token
    });
});


exports.logout = CatchAsync(async (req, res, next) =>{
    res.cookie('token',null,{
        expires: new Date(Date.now()),
        httpOnly:true
    });

    res.status(200).json({
        success:true,
        message:"Logged out successfully"
    })
})

exports.changePassoword = CatchAsync( async(req,res, next) =>{

});


exports.getAll = CatchAsync(async (req,res,next)=> {

    const users = await UserModel.find();

    res.status(200).json({
        success:true,
        size: users.length,
        data:users
    });
})

exports.getbyId = CatchAsync(async (req,res,next)=> {
    // console.log(req.params)

    if(!req.params.id || !isValidObjectId(req.params.id))
        return next(new ErrorObject("invalid user id", 400));

    const user = await UserModel.findById(req.params.id);

    if(!user)
        return next(new ErrorObject("Invalid user. Contact admin"));

    res.status(200).json({
        success:true,
        user
    });
})

exports.create = CatchAsync(async (req,res,next)=> {

    const {username ,email ,password ,passwordConfirm} = req.body;

    if(!username || !email || !password || !passwordConfirm)
        return next(new ErrorObject("Please fill all fields", 400));

    const user = await UserModel.create({username, email, password, passwordConfirm});

    res.status(201).json({
        success:true,
        data:user
    });
});

exports.update = async (req,res,next)=> {

    const {username, email} = req.body;

    // console.log(req.params);

    const user = await UserModel.findById(req.params.id);

    if(!user)
        return next(new ErrorObject("no user with that details given found", 401));

    const updated = await UserModel.findByIdAndUpdate(user._id, {username, email}, {runValidators:false});
    
    res.status(200).json({
        success:true,
        data:updated
    })
}

exports.deleteUser = async (req,res,next)=> {

    const user_id = req.params.id

    const user = await UserModel.findById(user_id);

    if(!user)
        return next(new ErrorObject("No user found", 400));

    await UserModel.findByIdAndDelete(user_id);

    res.status(204).json({
        success:true
    });
}

exports.deleteAll = async (req,res,next)=> {

    // console.log("in here");
    await UserModel.deleteMany({});

    res.status(204).json({
        success:true
    });
}

exports.getUserByUserName = CatchAsync(async (req, res, next)=>{

    const {username} = req.params;

    const user = await UserModel.findOne({username});

    if(!user)
        return next(new ErrorObject("User not found", 404));

    res.status(200).json({
        success:true,
        data:user
    })
})