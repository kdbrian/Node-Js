const appError=require('./../utils/appError');

module.exports=(err,req,res,next)=>{

    err.statCode= err.statCode || 500;

    err.status= err.status || 'error';

    // console.log(err);
    // printing errors depending on the environment
    if (process.env.NODE_ENV === 'development') {

        errorDev(err,res);

    } else if(process.env.NODE_ENV === 'production') {

        /**Mongoose handlers*/
        if(err.name === 'CastError'){ err = handleCastError(err);}
        if(err.code === 11000 ){ err = handleDuplicateError(err);}
        if(err.name === 'ValidationError'){ err = handleValidationError(err);}

        /**Json web token handlers*/
        if(err.name === 'JsonWebTokenError'){ err = handleJWTError(err);}
        if(err.name === 'TokenExpiredError'){ err = handleTokenExpiredError(err);}
        
       errorProd(err,res);
    }
}

const errorDev=(err,res)=>{

    res.status(err.statCode).json({
        status:err.status,
        message:  err.message,
        stack:err.stack,
        error:err
    })

}


const errorProd=(err,res)=>{

    // console.log(err);
    // trusted error/known
    
    if(err.isOperational){

        res.status(err.statCode).json({
            status:err.status,
            message:err.message
        });
    }
    else{

        console.error("Error 😳⚡ :");
        // unknown error/programming
        res.status(500).json({
            status:'error',
            message:'Something wrong happened'
        });
    }
}

const handleCastError=(err)=>{
    /**Handling trying to access documents with invalid locator(id) in db error */
    const msg=`Invalid ${err.path} : ${err.value}`
    return new appError(msg,400)//bad request
}

const handleDuplicateError=(err)=>{
    /**Handling duplication of documents in db error */
    //finding the text between quotes .match(/(["'])(\\?.)*?\1/)
    // console.log(err.message.match(/(["'])(\\?.)*?\1/)[0]);
    return new appError(`Duplicate field : ${err.message.match(/(["'])(\\?.)*?\1/)[0]}. please use another value`,400);
}

const handleValidationError=(err)=>{

    //looping through the error object and getting the values of the errors.message
    const errors= Object.values(err.errors).map(er=>er.message);

    return new appError(`Invalid input.${errors.join('. ')}`,400);

}

const handleJWTError=(err)=> new appError('Invalid token. Please login again',401);//unauthorised

const handleTokenExpiredError=(err)=> new appError('Time expired. Please login again',401);//unauthorised