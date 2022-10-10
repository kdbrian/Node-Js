const appError=require('./../utils/appError');

module.exports=(err,req,res,next)=>{

    if(err.name === 'TokenExpiredError')err=handleTokenExpiredError(err);
    if(err.name === 'CastError')err=handleCastError(err);


    res.status(err.statCode || 500).json({
        status:(err.status || 'fail'),
        error:err,
        stack:err.stack
    });

}

// FUNCTIONS TO HANDLE DIFFERENT TYPES OF ERRORS
const handleTokenExpiredError=(err)=>{
    return new appError('Time expired.😴Login again..',401);
}

//invalid id
const handleCastError=(err)=>{
    return new appError('please enter a valid document id ☹ ..',401);
}
