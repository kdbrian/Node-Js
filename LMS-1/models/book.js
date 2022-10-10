const mongoose=require('mongoose');

const bookSchema=mongoose.Schema({
    
    title:{
        type:String,
        required:[true,'a book title is required']
    },

    publisher:{
        type:String
    },

    dateOfPublishing:{
        type:Date
    },

    genre:{
        type:String,
        enum:['agriculture','education','law','nursing','medicine'],
        required:[true,'you must categorize a book']
    }
});

const bookModel=mongoose.model('Book',bookSchema);

module.exports=bookModel;