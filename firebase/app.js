const express  = require('express');
require('dotenv/config');


const PORT = process.env.PORT || 3000;

const app  = express();

app.get('/', (req,res)=>{

    res.send("You have reached the home of this server")
})

app.listen(PORT, ()=>{

    console.log(`Server started at http://localhost:${PORT}/`);

})