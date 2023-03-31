const errorHandler = require('../utils/errorHandler');

module.exports = (err,req,res,next) =>{

    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server error'

    if(err.name === 'ValidationError') err = handleValidatorError(err);

    if( err.code === 11000) err= handleDuplicateError(err);

    if(err.name === 'JsonWebTokenError') err = handleJsonWebTokenError(err);


    if(err.name === 'TokenExpiredError') err = handleTokenExpiredError(err);


    if(process.env.NODE_ENV === 'development'){
        
        sendErrorDev(err,res);

    }else if(process.env.NODE_ENV === 'production'){
        
        sendErrorProd(err,res);

    }

}

const handleValidatorError=(err)=>{
    return (new errorHandler(`${Object.values(err.errors).map((e)=> e.message)}`,400));
}

const handleJsonWebTokenError=(err)=>{
    return (new errorHandler(`Invalid Jwt`,400));
}

const handleTokenExpiredError=(err)=>{
    return (new errorHandler(`Time expired please login again`,401));
}

const handleDuplicateError=(err)=>{
    return (new errorHandler(`User with ${Object.keys(err.keyValue)} exists`,400));
}

const sendErrorDev = (err,res)=>{
    // console.log("Dev");
    res.status(err.statusCode).json({
        success:false,
        status:`err.statusCode`.startsWith('4')?'fail':'error',
        message:err.message,
        stack:err.stack,
        err
    })
}

const sendErrorProd = (err,res)=>{
    // console.log("Prod");
    res.status(err.statusCode).json({
        success:false,
        status:`err.statusCode`.startsWith('4')?'fail':'error',
        message:err.message
    })
}