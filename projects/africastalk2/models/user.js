const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = mongoose.Schema({

    username:{
        type:String,
        required:[true,'Please enter a username'],
        maxLength:[30,'name cannot exceed 30 characters']
    },

    email:{
        type:String,
        required:[true,'please enter your email'],
        unique:true,
        validate:[validator.isEmail,'please enter a valid email']
    },

    password:{
        type:String,
        required:[true,'please enter a password'],
        minlength:[6,'password must be greater than 6 chars'],
        select:false
    },

    passwordConfirm:{
        type:String,
        required:[true,'please enter a password confirm'],
        validate:{
            validator : function(el){ return this.password === el; },
            message: "Password mismatch"
        }
    },

    //!link to the image of the user from a 3rd party server
    avatar:{

        public_id:{
            type:String,
            //required:true
        },

        url:{
            type:String,
            //required:true
        }

    },

    role:{
        type:String,
        default:'user'
    },

    createdAt:{
        type:Date,
        default:Date.now()
    },

    resetPasswordToken:String,
    
    resetPasswordExpiry:Date,

});

// ! encrypting passwords before saving
userSchema.pre('save', async function(next){
     if(!this.isModified('password') || !this.isNew) next();

     this.password = await bcrypt.hash(this.password,12);
     this.passwordConfirm= undefined;
     next();

});


//! FUNCTION TO SET THE JSON WEB TOKEN
userSchema.methods.createJWT = function(){

    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXP})
}

// ! Function to verify the user password
userSchema.methods.verifyPassword= function(inputPassword){
    return bcrypt.compare(inputPassword,this.password);
}

// ! Function to generate password reset Token
userSchema.methods.generateResetToken= function(){
    
    const rstToken = crypto.randomBytes(20).toString('hex');

    // encrypt and store
    this.resetPasswordToken = crypto.createHash('sha256').update(rstToken).digest('hex');

    // token will expire after 10 minutes
    this.resetPasswordExpiry = Date.now() + 10 * 60 * 1000;

    return rstToken;

}

module.exports = mongoose.model('User',userSchema);