const validator=require('validator')
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs');
const crypto=require('crypto');


const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:[true,'a user must have a username'],
        maxlength:[8,'a username cannot exceed 8 characters'],
        lowercase:true
    },

    email:{
        type:String,
        unique:true,
        validate:[validator.isEmail,'provide a valid email'],
        lowercase:true
    },

    password:{
        type:String,
        minlength:[8,'a password must have a minimim of 8 characters'],
        required:[true,'please provide a password'],
        select:false
    },

    passwordConfirm:{
        type:String,
        required:[true,'password confirm field cannot be blank'],
        validate:[function(passwordConfirm){return passwordConfirm === this.password},'password and password confirm mismatch']
    },

    reqisteredAt:{
        type:Date,
        default:Date.now()
    },

    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    passwordResetToken:String,
    passwordChangedAt:Date,
    resetTokenExpires:Date
});


// encrypting the password before save
userSchema.pre('save',async function(next) {

    if(!this.isModified('password')) return next();

    // console.log('save pwd enc called');

    this.password=await bcrypt.hash(this.password,12);
    // ensuring the password confirm field is not added to the database
    this.passwordConfirm=undefined;
    next();
});

// setting the date for the password change
userSchema.pre('save',function(next){
    // console.log('save pwd change called');
    if(!this.isModified('password') || this.isNew)return next();

    this.passwordChangedAt= Date.now() -1000;

    next();
});

// function to verify the password during logging in using instance methods
// userSchema.methods.verifyPassword=function(inputPassword,userPassword) {
//     return bcrypt.compare(inputPassword,userPassword);
// }

/**
 * creates a password reset token using crypto.randomBytes
 * creates and sets the passwordResetToken field and the resetToken epires in the database
 * returns the token and stores an encryption version of it in the database
 */
userSchema.methods.createPasswordReset= function(){
    // console.log('create pwd token called');

    // reset token will be random bytes
    const token=crypto.randomBytes(32).toString('hex');

    this.passwordResetToken=crypto.createHash('sha256').update(token).digest('hex');

    // creating a time lapse before the reset token becomes invalid
    this.resetTokenExpires=Date.now() + 10 * 60 * 1000

    return token;
}


const User=mongoose.model('User',userSchema);

module.exports=User;