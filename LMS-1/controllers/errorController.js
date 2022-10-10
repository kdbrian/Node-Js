const errorObj=require('./../utils/error');

module.exports=(err,req,res,next)=>{

    if(err.name === 'TokenExpiredError' || err.message.startsWith('TokenExpiredError')) err= TimeExpired(err);
    
    if(err.name === 'ValidationError') err= ValidationError(err);

    if(err.code === 11000) err=handleDuplicateError(err);
    
    // console.log(err.status);
    

    err.statCode=err.statCode || 500
    err.status=`${err.statCode}`.startsWith('4')?'fail':'error'

    // console.log(err.statCode);

    //! handling errors in both production and development environment

    if(process.env.Node_env === 'development'){

        // console.log(err);
        res.status(err.statCode).json({
            status:err.status,
            message:err.message || err,
            stack:err.stack,
            error:{
                err
            }
        })

    }else if(process.env.Node_env === 'production'){

        res.status(err.statCode).json({
            status:err.status,
            message:err.message || err
        })

    }
}

//! handling specific errors out of ones created during dev
/**
 * function to handle time expired error
 * @returns error object
 */
 const TimeExpired=()=> {
    return new errorObj("Time expired please log in again",401);
}

const ValidationError=(err)=> {
    return new errorObj(err.message,401);
}

const handleDuplicateError=(err)=>{
    return new errorObj(`Duplication detected. Please unique values`,400);
}