require('dotenv/config');
const app = require('./app');
const mongoose = require('mongoose');


const PORT = process.env.PORT || 4000


//! Database connection
mongoose.connect(process.env.DB_URI).then(()=>{
    console.log('============================================');
    console.log(`Database connection at ${process.env.DB_URI}`);
    console.log('============================================');

}).catch((err)=>{

    console.log('**********************************************');
    console.log(`Database connection failed with error : ${err}`);
    console.log('**********************************************');
    process.exit(1);
})

//! Starting main Application
app.listen(PORT,()=>{
    console.log(`Development server started on port ${PORT} \n Visit http://localhost:${PORT}/`);
});