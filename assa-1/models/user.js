const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        require:[true,'a user must have a name'],
        trim:true,
        lowercase:false,
        unique:true
    },

    email:{
        type:String,
        required:[true,'a user must have an email'],
        validate:[validator.isEmail,'provide a valid email adress'],
        unique:true
    },

    // url of photo : can be uploaded from third party server
    photo:{
        type:String
      },

    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },

    dateJoined:{
        type:Date,
        default:Date.now(),
        select:false
    },

    dateDeleted:{
        type:Date,
    },

    password:{
        type:String,
        required:true,
        minlength:[8,'a password cant be short than 8 characters'],
        lowercase:false,
        trim: true,
        // select:false
    },

    passwordConfirm:{
        type:String,
        required:[true,'provide a password confirmation'],
        validate:{
            
            validator:function(el){ return el === this.password;},

            message:"Password must match password confirm"
        }
    },

    pwdChanged:String,
    passwordChangedAt:Date,
    passwordResetToken:String,
    resetTokenExpire:Date,

    canModify:{
        type:Boolean,
        default:true
    },

    isActive:{
        type:Boolean,
        default:true,
        select:false    
    }  
},{virtuals: true});


/***
 * Function to encrypt plain text password 
 * only if user isNew or the password field has been modified
 */
userSchema.pre('save',async function(next){
    if(this.isNew ){
        this.password = await bcrypt.hash(this.password,12);
        this.passwordConfirm=undefined;
        next();
    }
    
    next();
})

/***
 * Function to encrypt plain text password  after pwd is changed
 * only if user isNew or the password field has been modified
 */
userSchema.pre('save',async function(next){
    if(this.pwdChanged === 'true'){
    // console.log(`${this}:true`);
        this.password = await bcrypt.hash(this.password,12);
        this.passwordConfirm=undefined;
        this.pwdChanged = undefined;

        next();
    }
    next();
})

/***
 * Function to compare input password to the one in the database
 */
userSchema.methods.verifyPassword= function (inputPassword){
    return bcrypt.compare(inputPassword,this.password)
}

userSchema.methods.createPwdResetToken = async function(){
    const token = crypto.randomBytes(16).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    this.resetTokenExpire = new Date(Date.now() + 10 * 24 * 3600 * 1000);
    
    await this.save({validateBeforeSave:false});

    return token;
}


module.exports = mongoose.model('User',userSchema);