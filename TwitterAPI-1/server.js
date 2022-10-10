require('dotenv/config');
const mongoose=require('mongoose');
const app=require('./app');

const PORT= process.env.PORT;

// console.log(mongoose.version); || 3000

// const connectDB = async ()=>{

//     try{
//         // mongoose.set("useNewUrlParser",true)
        
//         await mongoose.connect(process.env.DB_URI);

//         console.log("Connected");

//     }catch(err){
//         console.log(err);
//     }
// }

// ! database connection

// always use DB_URI='mongodb://0.0.0.0:27017/'
mongoose.connect(process.env.DB_URI,()=>{

    console.log('====================================');
    console.log(`Database connection at ${process.env.DB_URI}`);
    console.log('====================================');

}).catch(err=>{
    console.log(err);
    process.exit(1);
})
// connectDB();

app.listen(PORT,()=>{
    console.log(`Server started at http://localhost:${PORT}`);
});
