require('dotenv/config');
const app= require('./app');
const morgan = require('morgan');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;

//? Handling the uncaught exceptions
process.on('uncaughtException', err => {
    console.log(`Error ${err}`);
    console.log('Closing the server due to uncaught exceptions');
    server.close(()=>{
        process.exit(1)
    })
})
if(process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));


//!Database connection
mongoose.connect(process.env.DB_URI_LOCAL,()=>{
    console.log(`Database connection to ${process.env.DB_URI_LOCAL} made successfully.`);
});

app.listen(PORT,()=>{
    console.log(`Server started at http://localhost:${PORT}/`);
});

//? Handling the unhandles rejections
process.on('unhandledRejection', err => {
    console.log(`Error ${err}`);
    console.log('Closing the server due to unhandled Rejection');
    server.close(()=>{
        process.exit(1)
    })
})