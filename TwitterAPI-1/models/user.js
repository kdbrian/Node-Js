const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt =require('bcryptjs');
const crypto=require('crypto');
const tweetModel=require('./tweet');

const userSchema=mongoose.Schema({

    username:{
        type:String,
        unique:[true,'a user with that username already exist'],
        minlength:[5,'Short Username'],
        required:[true,'provide a username']
    },

    email:{
            type: String,
            required:[true,'provide an email'],
            validate:[validator.isEmail,'Invalid email adress'],
            unique: true,
            lowercase:true
    },

    password:{
        type: String,
        select:false,
        minlength:[8,'a password must be more than 8 characters'],
        required:[true,'provide a password']
    },

    passwordConfirm:{
        type: String,
        required:[true,'provide a password'],
        validator:{
            function (el) {
                return el === this.password
            },
            message:"Password mismatch"
        },     
    },
    
    bioData:{
        
        DOB:{
            type: Date
        },

        location:{
            type:String
        },

        // to store link to the picture
        // ? will use cloudinary to store images
        avatar:{

            public_id:{
                type:String,
                required:true
            },

            url:{
                type:String,
                required:true
            }
        }
    },

    socialStatus:{

        followers:{
            amount:{
                type:Number,
                default:0
            },
    
            // array of user accounts objects
            followersList:[
                {
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'User'
                }
            ]
        },
    
        following:{
            amount:{
                type:Number,
                default:0
            },
            followingList:[
                {
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'User'
                }
            ]
        },

        tweets:{
            amount:{
                type:Number,
                default:0
            },
            
            //list of the tweets
            tweetsList:[
                {
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'Tweet'
                }
            ],

            likes:{
                type:Number,
                default: 0
            }
        },

    },
    
    accountStatus:{

        isActive:{
            type:Boolean,
            default:true
        },

        isSuspended:{
            type:Boolean,
            default:false
        },

        verified:{
            type:Boolean,
            default:false
        },

        role:{
            type:String,
            enum:['user','admin','tester'],
            default:'user'
        }
    },
    
    passwordReset:{
        pwdResetToken:String,
        passwordChangedAt:Date,
        pwdTokenExpires:Date,
        
        pwdResetRequests:{
            type:Number,
            default:0
        }
    },

},{virtuals: true});

/**
 * function to encrypt plain passwords
 * for newly created documents and modified ones
 */
userSchema.pre('save',async function(next){
    if(!this.isNew || !this.isModified('password'))next();

    // console.log("reached here");

    const hashedPwd = await bcrypt.hash(this.password,12);

    // console.log(`${this.password} : ${hashedPwd}`);

    this.password=hashedPwd
    this.passwordConfirm=undefined;

    next();
});

/**
 * function to compare plain text passwords and the encrypted ones in the database
 */
userSchema.methods.verifyPassword= function (inputPassword,userPassword){
        return bcrypt.compare(inputPassword,userPassword);
}

/**
 * Function to update the number of likes
 * @returns { nothing}
 */
userSchema.pre('save',async function(next){
    // if user is new or no followers yet calls next()
    if(this.isNew || this.socialStatus.tweets.tweetsList.length === 'undefined' )next();

    // console.log("outhere",this.socialStatus.tweets.tweetsList.length);
    this.socialStatus.tweets.likes = this.socialStatus.tweets.tweetsList.length;
    next();
});

/**
 * Function to suspend account if the password request reach 3
 * @returns 
 */
userSchema.pre('save', function(next){
    if(this.isNew) next();

    if(this.passwordReset.pwdResetRequests > 3){

        this.accountStatus.isSuspended=true;

        this.passwordReset.pwdResetToken=undefined;
        this.passwordReset.pwdTokenExpires=undefined;
        this.passwordReset.pwdResetRequests=undefined;

    }

    next();
})

/***
 * Function to create a token to be used to reset the password
 */
userSchema.methods.createResetPasswordToken=async function(){

    const code=crypto.randomBytes(32).toString('hex');

    return code;
}

// filtering the find query
userSchema.pre(/^find/,function(next){
     this.find({"accountStatus.isSuspended":{$ne:true},"accountStatus.isActive":true});
    next();
})

const User=mongoose.model('User',userSchema);

module.exports=User;
