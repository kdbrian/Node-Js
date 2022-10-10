const userModel=require('./../models/user');
const errorObj=require('./../utils/error');


exports.createUser=async (req,res,next)=>{
    
    try {

        const newUser= await userModel.create(req.body);

        res.status(200).json({

            status:"success",

            data:{
                newUser
            }
        })
        
    } catch (err) {

        return next(err);

    }
    
}

exports.getUserById=async (req,res,next)=>{

  
    try {

        if(!isValidObjectId(req.params.id))return next(new errorObj("Invalid  user id",400));

        const  user= await userModel.findById(req.params.id);

        if(!user)return next(new errorObj("No user found",404));


        res.status(200).json({
            status:"success",
            data:{
                user
            }
        });

    } catch (err) {

        return next(err);

    }
}

exports.getUser=async (req,res,next)=>{
  
    try {
        
        const  users= await userModel.find().select('email name role');

        res.status(200).json({
            status:"success",
            data:{
                users
            }
        })
    } catch (err) {
        return next(err);
    }
}

exports.updateUser=async (req,res,next)=>{
  
    try {

        const user= await userModel.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true});

        if(!user)return next(new errorObj("User not found",404));

        res.status(200).json({
            status:"success",
            data:{
                user
            }
        })
        
    } catch (err) {

        return next(err);

    }
}

exports.deleteUser=async (req,res,next)=>{
  try{
    
    await userModel.findByIdAndDelete(req.params.id);
    
    res.status(204).json({
        status:"success"
    })

  }catch (err) {
   
    return next(err);
    
  }
    
}