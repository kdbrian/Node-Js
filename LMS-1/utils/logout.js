//function to log out the user
const userModel=require('./../models/user');
const studentModel=require('./../models/student');
const {promisify}= require('util');
const jwt=require('jsonwebtoken');

const logout=(userType)=>{
    return (
        async (req,res,next)=>{

            // !check that user is actually logged in
            if(!req.headers.authorization || !req.headers.authorization[0].startsWith('B')){
                return next("You have to be logged in");
            }
        
            //! get the token from the headers
        
            let token=req.headers.authorization.split(' ')[1];
        
            //console.log(token);

            //! decode the token
            const Payload= await promisify (jwt.verify)(token,process.env.JWT_SECRET);

            //check if user with the token exists

            // console.log(Payload);

            if(userType === 'user'){

                const user= await userModel.findOne({_id:Payload.id});

                if(!user) {
                        return next("User doesnt exist please login again");
                }

            }else if(userType === 'student'){

                const student= await studentModel.findOne({_id:Payload.id});

                if(!student) {
                        return next("student doesnt exist please login again");
                }

            }
        
            //! set to undefined 
            token=undefined;
        
            //! send a response back or redirect back to login page
            res.status(200).json({
                status:"success",
                token
                
            });

            // res.redirect('/login');
        
        }
    )
}

module.exports=logout