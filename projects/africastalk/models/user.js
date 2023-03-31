const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const UserSchema = mongoose.Schema({

    username:{
        type: String,
        required:true,
        minLength:[8, 'a minimum of 8 characters is required for a username'],
        unique:true
    },

    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        validate:[validator.isEmail, 'provide a valid email adress']
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

    isActive:{
        type:Boolean,
        default:true
    },

    role:{
        type:String,
        enum:['user','admin', 'superuser'],
        default:'user'
    },

    dateJoined:{
        type:Date,
        default:Date.now()
    }

}, {virtuals:true});

UserSchema.pre('save', async function(next){

    if(!this.isNew || !this.isModified('password'))
        next();
    
    //encrypt password and remove password confirmation
    this.password = await bcrypt.hash(this.password, 12);
    // console.log(this.password);
    this.passwordConfirm =undefined;

    // console.log(this);
    next();
});

//! FUNCTION TO SET THE JSON WEB TOKEN
UserSchema.methods.createJWT = function(){

    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXP})
}

// ! Function to verify the user password
UserSchema.methods.verifyPassword = function(inputPassword){
    return bcrypt.compare(inputPassword,this.password);
    // console.log('working');
}


module.exports = mongoose.model('User', UserSchema);