const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt =require('bcryptjs');
const { find } = require('lodash');

const studentSchema=mongoose.Schema({

    firstName:{
        type:String,
        required:[true,'provide a first name'],
        minlength: [4,'a name must have not less than 4 characters']
    },

    lastName:{
        type:String,
        required:[true,'provide a last name'],
        minlength: [4,'a name must have not less than 4 characters']
    },

    yearOfStudy:{
        type:Number,
        enum:[1,2,3,4],
        required:[true,'provide your current year of study']
    },

    DOB:{
        type:Date,
        required:[true,'provide your Date of Birth']
    },

    // to be created by the system
    schoolEmailAdress:{
        type:String,
        lowercase:true
    },
    
    // add functionality to check if course provided matches the code in the registration number
    courseTitle:{
        type:String,
        required:[true,'provide the course you are taking e.g Bachellors Computer Science']
    },

    coursePeriod:{
        type:Number
    },

    //to be gotten from the course name
    courseCode:{
        type:String
    },

    studentNo:{
        type:String,
        required:[true,'provide the letters between your course code and the year of Joining i.e courseCode/.../year']
    },

    // creating the students registration number to be used during logging in
    regNo:{
        type:String,
        unique:true
    },

    DateJoined:{
        type:Date,
        required:[true,'provide the date you joined the school']
    },

    // to be calculated by the system
    yearOfGraduation:{
        type:Number
    },


    specialNeeds:{
        type:String,
        enum:['yes','no'],
        required:[true,'select if you have any special needs']
    },

    password:{
        type:String,
        default:'123456',
        select:false 
    },

    passwordConfirm:{
        type:String,
        default:'123456',
        validate:{
            validator: function(el){
                return el === this.password
            },
            message:"Password mismatch"
        },
        select:false
    },

    pwdResetCode:{
        type:String
    },

    resetPwdRequests:{
        type:Number,
        default:0
    },

    accountSuspended:{
        type:Boolean,
        default:false,
        select:false
    },
    passwordResetExp:{
        type:Date
    },
    passwordChangedAt:{
        type:Date,
        select:false
    },

    isActive:{
        type:Boolean,
        default:true
    },
    userType:{
        type:String,
        default:"student",
        enum:['student']
    }
})

studentSchema.pre('save',async function(next){

    if(!this.isModified('password') && !this.isNew){
        this.passwordConfirm=undefined;
        return next();
    }

    //creating a registration number
    this.regNo=`${this.courseCode}/${this.studentNo}/${new Date(this.DateJoined).getFullYear().toString().slice(2)}`
    //this.studentNo=undefined;


    //setting the organisation email adress
    this.schoolEmailAdress=`${this.firstName}.${this.lastName}@st.org.ac.ke`

    //encrypting the password
    this.password=await bcrypt.hash(this.password,12);
    this.passwordConfirm=undefined;

    // setting the special needs field
    this.specialNeeds= (this.specialNeeds === 'yes')?'yes':undefined;

    //setting the course coursePeriod
    const startsText=`${this.courseTitle}`[0].toLocaleUpperCase();

    switch(startsText){
        case 'B':
            this.coursePeriod=4
            break;
        
        case 'D':
            this.coursePeriod=2;
            break;

        case 'M':
            this.coursePeriod=2;
            break;

            default:
                this.coursePeriod=undefined;
                break;
    }

    // setting the year of yearOfGraduation
    //const testDate=new Date(Number(this.DateJoined) + (this.coursePeriod * 365 *24 * 3600 * 1000));
    const dateGraduation=new Date(Number(this.DateJoined) + (this.coursePeriod * 365 *24 * 3600 * 1000));
    this.yearOfGraduation=dateGraduation.getFullYear()
    // console.log(this.DateJoined,this.yearOfGraduation,this.coursePeriod,testDate);

    this.DateJoined=new Date(Number(this.DateJoined)).toDateString();

    next();
})

//insert a query middlware that checks for active and not suspended accounts

studentSchema.pre(/^find/,async function(){
    // console.log("Function called before find query");
    // console.log(this.model);
    // this.Query=this.getQuery() + {accountSuspended:{$ne:true},isActive:{$ne:false}}
    //const doc= await this.model.find({accountSuspended:{$ne:true},isActive:{$ne:false}});
    //console.log(doc);
    // this._conditions= this._conditions + find({accountSuspended:{$ne:true},isActive:{$ne:false}}); 
    //    next();

    // console.log(this.getQuery());

})

/**
 * Function that checks a user password against the one in the database
 */
studentSchema.methods.verifyPassword= function (inputPassword,userPassword){
    return bcrypt.compare(inputPassword,userPassword);
}

const Student=mongoose.model('Student',studentSchema);

module.exports=Student;