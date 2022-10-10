/**Handles all the email function */

const nodemailer=require('nodemailer');

/**
 * function to send reset password email
 * @param {all the email parameters} options 
 */
const sendEmail=async (options)=>{

    // 1. Create a transporter(a service that will change the email e.g gmail)
    const transporter=nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth:{
            user:process.env.USER_NAME,
            pass:process.env.PASSWORD
        }

        // activate the "les secure app options in gmail"
    })

    // 2. define email options

    const mailOptions={
        from: ' Brian Kidiga <naka18mura@gmail.com>',
        to:options.email,
        subject:options.subject,
        text:options.message
    }

    // 3. send the email with nodemailer

    await  transporter.sendMail(mailOptions)

}

module.exports  = sendEmail;

/**
 * var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "740755f792dd32",
    pass: "a4f5f702220dcf"
  }
});
 */