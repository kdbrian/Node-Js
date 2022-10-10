const {Schema,mongoose} = require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const crypto=require('crypto');

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate:[ validator.isEmail,'provide a valid email']
  },
  photo:{
    type:String
  },
  role:{
    type:String,
    enum:['user','guide','lead-guide','admin'],
    default:'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select:false
  },
  passwordConfirm:{
    type: String,
    required: [true, 'Please provide a password'],
    validate:{
      validator: function(el) { return el===this.password; }
      ,
        message:"Password are not the same"
    }
  },
  passwordChangedAt:Date,
  passwordResetToken:String,
  resetTokenExpire:Date,
  active:{
    type:Boolean,
    default:true ,
    select:false     
  }  
});

// encrypting the plain passwords
userSchema.pre('save', async function(next){

  // encrypting the password only on updating and creation
  if(!this.isModified('password')) return next();
 
  this.password=await bcrypt.hash(this.password,12);

  this.passwordConfirm=undefined;
  next();
})

/**Using an instance method-->will be available to all documents of the user collection */
// userSchema.methods.verifyPassword = async function(candidatePassword,userPassword){
  // return true(c===u) false(c!==u)
//   return (await bcrypt.compare(candidatePassword,userPassword));
// }
// userSchema.static('verifyPassword' , async function(candidatePassword,userPassword){
//     return await bcrypt.compare(candidatePassword,userPassword);
// })

userSchema.methods.changedPasswordAfterTokenIssued=function(JWTTimestamp) {

  if(this.passwordChangedAt){
    // converting the time to seconds
    const changedTimeStamp=parseInt(this.passwordChangedAt.getTime()/1000,10);

    // console.log(this.passwordChangedAt,JWTTimestamp);

    // jwttimestamp->time when token was issued
    // changed timestamp-->time when the password was changed
    return JWTTimestamp<changedTimeStamp;
  }
  
  return false;
}

userSchema.methods.createPasswordResetToken= function () {
  // generating the random token
  const resetToken=crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.resetTokenExpire = Date.now()+10 *60 * 1000;

  // console.log({resetToken},this.passwordResetToken);

  return resetToken;
}

userSchema.pre('save',function(next){
  // setting the passwordChangedAt field to the time the password is changed
  if(!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt=Date.now() - 1000;
  next();
})

// function to check if current user is active
// uses a regex to check all queries that start with find
// query middle ware
userSchema.pre(/^find/,function(next){
    // this points to the current query
    // only return docs with active field set to true
    this.find({active:{$ne:false}});
    next();
})

userSchema.methods.verifyPassword= function (candidatePassword,userPassword){
  return bcrypt.compare(candidatePassword,userPassword);
}


const User = mongoose.model('User', userSchema);

module.exports = User;


