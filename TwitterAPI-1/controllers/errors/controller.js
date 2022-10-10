const errorObject= require('./../../utils/error');

module.exports=(err,req,res,next)=>{

    // console.log(err);

    if(err.name === 'ValidationError') err=handleValidationError(err);

    //duplication error handling
    if(err.code === 11000 ) err=handleDuplicateError(err);

    res.status(err.statCode || 500).json({
        status:`${err.statCode}`.startsWith('4')?'fail':'error',
        message:err.message,
        err
    })

}

const handleValidationError=(err)=>{
        return new errorObject(err.message,400);
}

const handleDuplicateError=(err)=>{

    // console.log(err);

    //loop through to get duplicate keys
    let demo=""

    for (const key in err.keyValue ){

        demo += `${key.toString()}`;
    }
    
    const msg= ` ${demo} already in taken`;

    return new errorObject(msg,400);
}