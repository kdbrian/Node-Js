const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./controllers/errorHandler');
const app = express();

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use(cookieParser());


if(process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));

    
//! Routing
//admin specific
app.use('/api/v1/admin/users',userRoutes);

//user specific
app.use('/api/v1/user',authRoutes);


//!Global error handling
app.use(globalErrorHandler);


//!unhandled routes
app.all('*',(req,res)=>{
    res.status(404).json({
        status:'fail',
        message:`Cannot ${req.method} ${req.url} on this site`
    })
});

module.exports = app;