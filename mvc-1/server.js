const dotenv=require('dotenv');
dotenv.config({path:'./config.env'})
const mongoose=require('mongoose');
// process.env.DB_URI || 

const dbURI=process.env.DB_URI_LOCAL;

// catching unhandled rejections
process.on('unhandledRejection',(err)=>{
    
    console.log(err.name,err.message);
    console.log('unhandled rejection occurred');
    process.exit(1);
})

// catching uncaught exeptions
process.on('uncaughtException',(err)=>{
    console.log(err);
    console.log(err.name,err.message);
    console.log('uncaught exception occurred');
    process.exit(1);
})


mongoose.connect(dbURI).then(conn=>{
    console.log(`Db connection successful on ${dbURI}`);
}).catch(err=>{
    console.log("An error occured...!!!\tFailed to connect to Database");
    process.exit(1);
})


const app=require('./app');

//enviroment variables
// console.log(app.get('env'));
// console.log(process.env);

const PORT=process.env.PORT || 3000
const server=app.listen(PORT,()=>{
    console.log(`Server successfully started at http://localhost:${PORT}`);
})



// console. log(x);