
/***
 * class that  creates an error object that we are able to
 * catch errors and create appropriate status code for them
 * It Extends the Error class
 */
class error extends Error{

    constructor(message,statCode){
        super(message);
        this.statCode=statCode;
        this.isOperational=true;
        this.stack= Error.captureStackTrace(this,this.constructor);
    }
}

module.exports = error;