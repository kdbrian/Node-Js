const errorObj = require('../utils/error');

exports.protect= async (req,res,next)=>{

    // const {jwt} = req.cookie;

    console.log(req);

    next();
}