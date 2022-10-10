const errorObj = require('../utils/errorObj');

module.exports = (err,req,res,next) =>{

    if (err.code === 11000) err=handleDuplicateError(err);
    if (err.name === 'ValidationError') err=handleValidationError(err);

    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'server failure';

    res.status(err.statusCode).json({
        status:`${err.statCode}`.startsWith('4') ?'fail':'error',
        message:err.message,
        stack:err.stack,
        err
    });
    
}

const handleDuplicateError = (err)=>{
    let duplicatefields = [];

    for(field in err.keyPattern)
        duplicatefields.push(field);

        return new errorObj(`Duplicate ${duplicatefields.toString()} choose another one`,400);
}

const handleValidationError = (err) => {
    return new errorObj(`${err.message}`,400);
}