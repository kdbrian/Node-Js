const mongoose=require('mongoose');
const bcrypt =require('bcryptjs');


const tweetSchema=mongoose.Schema({

    tweetedBy:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'User'
    },

    message:{
        type:String,
        required:[true,'a tweet cannot be empty'],
        minlength:[5,'short message for a tweet'],
        maxlength:[20,'create a new thread']
    },
    //! to store the ref to the profiles of the ppl who liked the tweet
    //! the size of the array will be the amount of likes
    likes:[
        // ? an array of the users who liked
        {
            type:mongoose.Schema.Types.ObjectId,
            require:true,
            ref:'User'
        }
    ],

    amountLikes:{
        type:Number,
        default:0
    },

    retweets:[
        // ? an array of the users who retweeted
            {
                type:mongoose.Schema.Types.ObjectId,
                require:true,
                ref:'User'
            }
    ],

    Comments:[
        // ? an array of the users who commented

            {
                type:mongoose.Schema.Types.ObjectId,
                require:true,
                ref:'User'
            }
    ],

    hashTags:{
        type:[String]
    },

    dateTweeted:{
        type:Date,
        default:Date.now()
    },

    insights:[String],

    deleted:{
        type:Boolean,
        default:false
    }

});


// encrypting the message to the database
tweetSchema.pre('save', async function(){

});



const Tweet=mongoose.model('Tweet',tweetSchema);

module.exports=Tweet;