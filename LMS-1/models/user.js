// the user model
const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt =require('bcryptjs');
const crypto=require('crypto');

const userSchema=mongoose.Schema({
    name:{
        type: String,
        minlength:[8,'a user name must be longer ir equal to 8 characters'],
        required:[true,'a username is required']
    },

    email:{
        type:String,
        lowercase:true,
        validate:[ validator.isEmail,'provide a valid email'],
        required:[true,'an email is required for official communication'],
        unique:true
    },

    password:{
        type: String,
        required:[true,'provide a password'],
        select:false,
        minlength: [8,'a password must exceed 8 characters']
    },

    passwordConfirm:{
        type: String,
        required:[true,'a password confirmation must be  provided'],
        validate:{
            validator: function(el){ return el===this.password;},
            message:'password mismatch'
        }
    },

    role:{
        type:String,
        enum:['admin','visitor','parent','lecturer'],
        default:'visitor'
        //admins to sign up/in with specific previledges
    },
    
    isActive:{
        type:Boolean,
        default:true
    },
    pwdResetRequests:{
        type:Number,
        default:0
    },

    
    adminCode:{
        type:String,
        lowercase:true
    },

    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExp:{
        type:Date
    },
    accountSuspended:{
        type:Boolean,
        default:false
    }

});


// encrypting the passwrd
userSchema.pre('save',async function(next){
    
    if(!this.isModified('password')) return next();
 
    this.password=await bcrypt.hash(this.password,12);
  
    this.passwordConfirm=undefined;
    next();
});

userSchema.methods.checkPassword= function (inputPassword,userPassword){
    return bcrypt.compare(inputPassword,userPassword);
}

//! creating a email for the admins
userSchema.pre('save',async function(next){

    if(!this.isNew || this.role !== 'admin')return next();

    //! creating a unique code only for the admins
    const code=await crypto.randomBytes(5).toString('hex');

    const encryptedCode= await crypto.createHash('sha256').update(code).digest('hex');

    this.adminCode=encryptedCode;

    // send the code to the admins email
    // demo
    // 63 earth can fit in Ur anus
    console.log(`Use this code next time you login\nKeep it secured ${code}`);

    
    next();
});



const User=mongoose.model('User',userSchema);

module.exports=User;