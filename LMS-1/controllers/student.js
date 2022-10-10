const studentModel=require('./../models/student');
const jwt=require('jsonwebtoken');
const crypto=require('crypto');
const {promisify}= require('util');
const errorObj=require('./../utils/error');
const checkAccStatus=require('./../utils/accSusp');

/**
 * Function to create a json web token for the user
 @param {* user id} id
 @returns {jwt}
 */
 const signToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn: process.env.JWT_SECRET_EXP});
}


exports.register=async (req,res,next)=>{
    try {

        const newstudent=await studentModel.create(req.body);

        res.status(200).json({
            status:"success",
            student:{
                newstudent
            }
        })
    } catch (err) {
        return next(new errorObj(err,401));
    }
}

exports.login=async (req,res,next)=>{

    try {
        // student can either use his/her email adress to log in with his/her password
        const {email,password} = req.body;
        
        if(!email || !password)
            return next(new errorObj("Provide all details required",403));
        
        const student=await studentModel.findOne({schoolEmailAdress:email}).select('+password +accountSuspended');

        if(! checkAccStatus(student)){
            return next(new errorObj("Account suspended or deleted contact customer care. 😂😂",401));
        }

        if(!student || ! await student.verifyPassword(password,student.password))
            return next(new errorObj("Invalid email or password",404));

        res.status(200).json({
            status:"login success",
            token:signToken(student._id)
        });

    } catch (err) {
        return next(new errorObj(err,401));
    }
}

exports.forgotPassword=async (req,res,next)=>{
    
    //! get the email from the body
    const {email}=req.body
    
    //! confirm its a students email
    // use regex to check that the email contains an st after @

    //! search a student with that email
    const student=await studentModel.findOne({schoolEmailAdress:email}).select('+accountSuspended');
    if(!email || !student) return next(new errorObj("please provide a valid email adress",401));

    if(! checkAccStatus(student)){
        return next(new errorObj("Account suspended or deleted contact customer care. 😂😂",401));
    }
    //! increment number if request made
    student.resetPwdRequests++;

    //!check if the number of reset pwd request made excedd limit=3 and suspend account
    if(student.resetPwdRequests > 3) {
        student.accountSuspended=true;
        await student.save({validateBeforeSave:false});
        return next(new errorObj("Exceeded number of reset requests. Contact admin for account recovery",305));
    }

    //! send a reset code to the students email
    //create a random code
    const randomCode= await crypto.randomBytes(6).toString('base64');

    const msg=`Code : ${randomCode} . Follow this url http://localhost:3000/api/lms/v1/students/reset-password`

    // console.log(randomCode);

    const code=crypto.createHash('sha256').update(randomCode).digest('base64');
    // console.log(code);

    // creating a time lapse before the reset token becomes invalid (10 minutes)
    student.passwordResetExp=Date.now() + 10 * 60 * 1000

    //save code in db for later confirmation
    student.pwdResetCode=code;
    student.accountSuspended=false;
    await student.save({validateBeforeSave:false});


    res.status(200).json({
        status:"success",
        message:msg
    })
}

exports.resetPassword=async(req,res,next)=>{
    try{
        const {code,password,passwordConfirm}=req.body
        
        if(!code || !password || !passwordConfirm)return next("Please fill all fields");

        //! get code from request body and encrypt for comparison

        const encCode= await crypto.createHash('sha256').update(code).digest('base64');

        //! check if student with that code exists

        const student= await studentModel.findOne({pwdResetCode:encCode}).select('+password');


        if(!student || !code) return next(new errorObj("Invalid Code.🐱‍👤🐱‍👤",404))

        //! change student password according to the ones on the body
        student.password=password;
        student.passwordConfirm=passwordConfirm;

        //! remove unnessecary fields from the database
        student.pwdResetCode=undefined;
        student.passwordChangedAt=Date.now()
        student.resetPwdRequests=undefined;
        student.passwordResetExp=undefined

        await student.save({validateModifiedOnly:true});

        res.status(200).json({
            status:"success",
            message:"pwd changed successfully. 🎉🎉"
        });

    }catch(err){

        return next(new errorObj(err,401));

    }

}

exports.getStudents=async (req,res,next)=>{
    try {
        
        const data= await studentModel.find();

        res.status(200).json({
            status:"success",
            number:data.length,
            result:{
                data
            }
        });

        // res.render('index',{data})

    } catch (err) {

        return next(new errorObj("Unresolved error occured",500));
        
    }
}

/*
exports.protect=async (req,res,next)=>{
    try {
        // will be using a bearer token
        //check if authorization header is set
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token=req.headers.authorization.split(' ')[1];

        }

        //check if token exists
        if(!token)return next("😥Please log in.😥");

        // verify token
        const payLoad= await promisify(jwt.verify)(token,process.env.JWT_SECRET);

        //console.log(payLoad);
        // check if user with that id exists
        const student=await studentModel.findById(payLoad.id);

        if(!student)return next("student cannot be found..😑😶please log in again");

        req.student=student;
        next();

    } catch (err) {
        return next(err);
    }
}
*/
