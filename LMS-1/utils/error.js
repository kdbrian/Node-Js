//to be able to trap status codes
/***
 * A error class to create errors and status codes
 * extends the error class
 */
class devError extends Error{

    constructor(message,statCode){
        super(message);
        this.statCode=statCode;
        this.isOperational=true;
        this.stack=Error.captureStackTrace(this,this.constructor);
    }
}

module.exports=devError;