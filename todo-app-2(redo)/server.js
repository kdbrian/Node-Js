const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});
const mongoose=require('mongoose');


const app=require('./app');
const DBURI=process.env.DB_URI;
// database connection
mongoose.connect(DBURI,()=>{
    console.log(`Database connection successful at ${DBURI}`);
}).catch(err=>{
    console.log("an error occured",err);
})



const PORT=process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Deployment server started at http://localhost:${PORT}`);
})