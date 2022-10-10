const { ObjectId } = require('bson');
const userModel=require('./../../models/user');
const errorObj=require('./../../utils/error');

exports.getUser=async (req,res,next)=>{
    try {
        
        const data= await userModel.find();

        res.status(200).json({
            status:"success",
            number:data.length,
            data
        });

    } catch (err) {
        
        return next(new errorObj(err,500));

    }
}

exports.getUserById = async (req,res,next)=>{

    try {
        if(! ObjectId.isValidObjectId(req.params.id)) return next(new errorObj("Invalid object id",404));

        const user= await userModel.findById(req.params.id);

        if(!user) return next(new errorObj("User not Found",404));

        res.status(200).json({
            status:"success",
            data:{
                user
            }
        })

    } catch (err) {
        
        return next(new errorObj(err,500));

    }


}

exports.createUser=async (req,res,next)=>{

    try {
        
        const user= await userModel.create(req.body);

        res.status(200).json({
            status:"success",
            user
        });

    } catch (err) {

        return next(err);

    }
}

exports.updateUser=async (req,res,next)=>{

    try{
        // get the user id from the params
        if(! ObjectId.isValid(req.params.id))return next(new errorObj("Invalid Id",404));
        // fetch user
        // update user

        const user= await userModel.findByIdAndUpdate(req.params.id,req.body,{new : true, runValidators:true});

        // send response

        res.status(201).json({
            status:"success",
            data:{
                user
            }
        });

    }catch(err){

        return next(new errorObj(err,500));

    }
    
}

exports.deleteUser=async (req,res,next)=>{

    try{
        // get the user id from the params
        if(! ObjectId.isValid(req.params.id))return next(new errorObj("Invalid Id",404));
        // fetch user
        // update user

        const user= await userModel.findByIdAndDelete(req.params.id);

        // send response

        res.status(204).json({
            status:"success"
        });

    }catch(err){

        return next(new errorObj(err,500));

    }

}