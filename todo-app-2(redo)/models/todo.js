const mongoose=require('mongoose');

const todoSchema=mongoose.Schema({
    title:{
        type:String,
        required:[true,'cannot create a todo without a title'],
        lowercase:true,
        trim:false,
        minlength:[5,'a title must exceed five characters'],
        unique:true
    },

    description:{
        type:String,
        maxlength:[30,'keep your description as short as possible'],
        required:[true,'please describe what the todo is about']
    },

    createdAt:{
        type:Date,
        default:Date.now()
    },

    priority:{
        type:String,
        enum:['important','medium','less important'],
        default:'medium'
    },

    reminder:{
        type:Date,
        required:[true,'please set a reminder for the todo']
    },

    isDone:{
        type:Boolean,
        default:false
    }
});

// the todo model
const Todo = mongoose.model('Todo',todoSchema);

module.exports=Todo;