
const sendToken = (user, statusCode, res) =>{

    const token = user.createJWT();

    // set cookie options

    const options = {
        expires: new Date(
            // converting to milliseconds
            Date.now() + process.env.cookie_EXP * 24 * 60 * 60 * 1000
        ),

        httpOnly:true
    };



    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        //token
    });

};


module.exports = sendToken;