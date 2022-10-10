const morgan=require('morgan');
const express=require('express');
const errorHandler=require('./Controllers/errorController');
const todoRoutes=require('./Routes/todoRoutes');
const userRoutes=require('./Routes/userRoutes');

const app=express();

// body parser
app.use(express.json())

if(process.env.Node_Env === 'development'){
    app.use(morgan('dev'));
}

// default routes
app.use('/api/v2/todos',todoRoutes)
app.use('/api/v2/users',userRoutes)

// handling errors globally
app.use(errorHandler);


// unhandles routes
app.all('*',(req,res,next)=>{
    res.status(404).json({
        status:'failed',
        message:`404..!! could not ${req.method}  ${req.url}`
    })
})



module.exports=app;