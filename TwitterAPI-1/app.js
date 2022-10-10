const express=require('express');
const userRoutes=require('./routes/user');
const tweetsRoutes=require('./routes/tweets');
const errorHandler=require('./controllers/errors/controller');

const app=express();

// body parser
app.use(express.json());


const morgan=require('morgan');


if(process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));



//routing the app
app.use('/twitter/api/users',userRoutes);
app.use('/twitter/api/tweets',tweetsRoutes);

// app.use('/twitter/api/users',userRoutes);


//! error handler
app.use(errorHandler);


// unhandled routes
app.use('*',(req,res)=>{

    res.status(404).json({
        status:"fail",
        message:`Cannot ${req.method} : ${req.url}on this server`
    });
});


module.exports=app;