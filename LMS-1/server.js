require('dotenv/config');
const app=require('./app')
const mongoose=require('mongoose');

//db config
mongoose.connect(process.env.DB_URI,()=>{
    console.log('====================================');
    console.log(`Connected to Database at ${process.env.DB_URI}`);
    console.log('====================================');
}).catch(()=>{
    console.log('====================================');
    console.log("Database connection failed");
    console.log('====================================');
    process.exit(1);
})

const PORT=process.env.PORT;

app.listen(PORT,()=>{
    console.log(`server started at http://localhost:${PORT}`);
})