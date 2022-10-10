//const auth = require('basic-auth');
const nodemailer=require('nodemailer');

const sendEmail=(options)=>{

    const transporter=nodemailer.createTransport({

        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,

        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASSWORD
        }
    })

    const emailOpt={
        from:'<HeadQuaters>',
        to:options.to,
        Subject:options.Subject,
        message:options.text

    }

    await transporter.sendMail(emailOpt);
}

module.exports=sendEmail;