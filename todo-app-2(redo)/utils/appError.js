class appError extends Error{
    // constructor
    constructor(message,statCode){
        super(message);
        this.statCode=statCode;
        this.status= `${this.statCode}`.startsWith('4')?'fail':'error';
        this.isOperational=true; // marking our errors as operation

        Error.captureStackTrace(this,this.constructor);
    }

 }

 module.exports=appError;