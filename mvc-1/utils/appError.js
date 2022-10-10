
class appError extends Error{

    constructor(msg,statCode){
        super(msg);
        this.statCode=statCode;
        this.status = (`${statCode}`.startsWith('4'))?'fail':'error';
        this.isOperational = true;
        Error.captureStackTrace(this,this.constructor);
    }

}


module.exports=appError;