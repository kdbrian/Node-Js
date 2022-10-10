const { isValidObjectId } = require('mongoose');
const userModel=require('./../models/user');
const catchAsync=require('./../utils/catchAsync');
const appError=require('./../utils/appError');

// CREATE
exports.createUser=catchAsync(async (req,res)=>{
    const user= await userModel.create(req.body);
        
        res.status(200).json({
            status:"user created successfully",
            data:{
                user
            }
        });
    
})
// READ
exports.getUsers=catchAsync(async (req,res)=>{

    const result= await userModel.find();

        res.status(200).json({
            status:"success",
            number:result.length,
            data:{
                result
            }
        });
});

exports.getUser=catchAsync(async (req,res,next)=>{
    
    if(!isValidObjectId(req.params.id)){
            return next(new appError('Invalid object id',404));
        }

        const result= await userModel.findById(req.params.id);

        res.status(200).json({
            status:"success",
            data:{
                result
            }
        });
        
})

// UPDATE

/**
 * function to limit the fields a user can update
 * @params {* updates body, array of allowed fields}
 * @returns {* the new filter object}
 */
function limitFields(updates,...allowedFields){
    let newObj={}
    Object.keys(updates).forEach(el=>{
        if(allowedFields.includes(el))
            newObj[el]=updates[el];
    });
    return newObj;
}

// function to update current user data
exports.updateMe=catchAsync(async (req,res,next)=>{

    // we dont update password here
    if(req.body.password || req.body.passwordConfirm) return next(new appError('Cannot update password',401));

    // limit the updates
    const updates= limitFields(req.body,'username','email');

    // update user

    const updatedUser= await userModel.findByIdAndUpdate(req.user._id,updates,{new:true,runValidators:true});
    
    // save updates

    // send a response

    res.status(200).json({
        status:"success",
        data:{
            updatedUser
        }
    })
})

exports.updateUser=catchAsync(async (req,res,next)=>{
    
    if(!isValidObjectId(req.params.id)){
        return next(new appError('Invalid object id',404));
    }

        const result= await userModel.findByIdAndUpdate(req.params.id,req.body,{new : true, runValidators:true});

        res.status(201).json({
            status:"success",
            data:{
                result
            }
        });
    })
// DELETE
exports.deleteUser= catchAsync(async (req,res,next)=>{
   
    if(!isValidObjectId(req.params.id)){
            return next(new appError('Invalid object id',404));
        }

        const result= await userModel.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status:"success"
        });
});
