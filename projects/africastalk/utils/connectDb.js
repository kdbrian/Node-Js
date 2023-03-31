const mongoose = require("mongoose")

const connect = async(uri) =>{

    await mongoose.connect(uri).then(()=>
    console.log('connected to db')
    ).catch(err => {
        console.log(`Failed to connect to db error ${err}`);
    })
}

module.exports = connect;