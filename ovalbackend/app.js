const express = require('express');
const globalHandler = require('./middlewares/errors');

const productRoute = require('./routes/products');
const orderRoute = require('./routes/orders');
const userRoute = require('./routes/user');

const authRoute = require('./routes/auth');


const cookieParser = require('cookie-parser');
const morgan=require('morgan');

const app = express();

app.use(express.json());
app.use(cookieParser());


if(process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));


app.use('/api/v1/users',authRoute);
app.use('/api/v1/products',productRoute);
app.use('/api/v1/orders',orderRoute);

// admin routes
app.use('/shop/api/v1/admin/users',userRoute);


// ? Global error handler
app.use(globalHandler);


module.exports = app;