const nodemailer = require('nodemailer');

const sendEmail = async (options) => {

    const transporter = nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        }
    });

    await transporter.sendMail({
        from:'<donotreply> c0d3.It',
        to:options.to,
        subject:options.subject,
        text:options.message
    });
}

module.exports = sendEmail;