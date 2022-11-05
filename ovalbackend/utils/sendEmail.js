const nodemailer = require('nodemailer');


const sendEmail = async options =>{

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,

        auth:{
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });


    const msg = {
        from:`${process.env.SMTP_EMAIL_FROM_NAME} <${process.env.SMTP_EMAIL_FROM}>`,
        to: options.email,
        subject:options.subject,
        text: options.message
    };

    await transporter.sendMail(msg);
    
}

module.exports = sendEmail;