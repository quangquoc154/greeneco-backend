const nodemailer = require('nodemailer')

const sendMail = async({ email, html }) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              user: process.env.NODEMAILER_EMAIL,
              pass: process.env.NODEMAILER_APP_PASSWORD
            }
        });
        let info = await transporter.sendMail({
            from: '"GreenEco" <no-relply-greeneco@gmail.com>',
            to: email,
            subject: 'Forgot Password',
            html: html
        }); 
        return info;
    } catch (error) {
        console.log(error);
    }
}

module.exports = sendMail;