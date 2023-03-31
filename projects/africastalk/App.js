const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const userRoutes = require('./routes/userroutes');
const globalErrorhandler = require('./utils/erroradapter');

dotenv.config()

const App = express();

if(process.env.NODE_ENV === 'development')
    App.use(morgan('dev'));


App.use(express.json());



App.use('/api.v1/users', userRoutes);



App.all('*', (req, res) => {
    res.status(404).json({
        success:false,
        message :  `Failed to [${req.method}] : ${req.url} on this server`
    })
})

App.use(globalErrorhandler);

module.exports = App;