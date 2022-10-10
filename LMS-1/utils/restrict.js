const errorObj=require('./../utils/error');

module.exports=(...roles)=>{

     return(
        async (req,res,next)=>{

            // const {user}=req;

            const role = req.user.role || req.student.role;

            if(!roles.includes(role)){
                return next(new errorObj('You dont have permission',403));
            }
        
            next();
        }
    )


}