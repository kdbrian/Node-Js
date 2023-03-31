const errorHandler = require('./ErrorHandler');;

module.exports = (err,req,res,next) =>{

    // console.log("Error ; ",err);

    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server error'

    if(err.name === 'ValidationError') err = handleValidatorError(err);
    if(err.name === 'TokenExpiredError') err = handleTokenExpiredError(err);
    // if(err.name === 'JsonWebTokenError') err = handleTokenExpiredError(err);

    

    if(process.env.NODE_ENV === 'development'){
        
        sendErrorDev(err,res);

    }else if(process.env.NODE_ENV === 'production'){
        
        sendErrorProd(err,res);

    }

}

const handleTokenExpiredError=(err)=>{
    return (new errorHandler(`Time expired please login again`,401));
}

const handleValidatorError=(err)=>{
    return (new errorHandler(`${Object.values(err.errors).map((e)=> e.message)}`,400));
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