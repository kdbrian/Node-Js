const express=require('express');
const toursRoute=require('./Routes/toursRoute')
const userRoute=require('./Routes/userRoute');
const appError=require('./utils/appError');
const globalErrorHandler=require('./Controllers/errorController');
const app=express();
const morgan=require('morgan');

app.set('view engine','ejs')
app.use(express.json());

//formatting terminal output
//middlewares
if(process.env.NODE_ENV === 'development'){
    // console.log(process.env);
    app.use(morgan('dev'))

}


//serving static files
app.use(express.static(`${__dirname}/public`));

app.use((req,res,next)=>{
    // console.log(req.headers);
    next();
})

//default routes
app.use('/api/tours',toursRoute);
app.use('/api/users',userRoute);



// handling unhandled routes
app.all('*',(req,res,next)=>{

    // res.status(404).json({
    //     status:"fail",
    //     message:`404!!!   Cant find ${req.originalUrl}`
    // })

    next(new appError(`!!!   Cant find ${req.originalUrl}`,404));

})
// error handler middleware
app.use(globalErrorHandler);


module.exports=app;