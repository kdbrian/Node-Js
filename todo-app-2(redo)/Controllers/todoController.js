const { isValidObjectId } = require('mongoose');
const todoModel=require('./../models/todo');
const catchAsync=require('./../utils/catchAsync');
const appError=require('./../utils/appError');

// CREATE
exports.createTodo=catchAsync(async (req,res)=>{
    
    const todo=await todoModel.create(req.body);
    res.status(200).json({
        status:'success',
        todo
    });
})
// READ
exports.getTodos=catchAsync(async (req,res)=>{

    const result=await todoModel.find();

    res.status(200).json({
        status:'success',
        Number:result.length,
        data:{
            result
        }
    });
})
// get todo by id
exports.getTodo=catchAsync(async (req,res,next)=>{
    
    
    
    const todo=await todoModel.findById(req.params.id);

   res.status(200).json({
        status:'success',
        data:{
            todo
        }
    });
})

// UPDATE
exports.updateTodo=catchAsync( async (req,res)=>{
    if(!isValidObjectId(req.params.id))return 
    const updatedTodo= await todoModel.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
    res.status(200).json({
        status:'success',
        todo:{
            updatedTodo
        }
    });
})

// DELETE
exports.deleteTodo=catchAsync (async (req,res)=>{

    const todo=await todoModel.findByIdAndDelete(req.params.id);

    res.status(401).json({
        status:'success'
    });
})
