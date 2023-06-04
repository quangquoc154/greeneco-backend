const sendEmail = async({ email, html }) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.example.com",
        port: 587,
        secure: true,
        auth: {
          user: process.env.NODEMAILER_EMAIL,
          pass: process.env.NODEMAILER_APP_PASSWORD
        }
    });
    let info = transporter.sendEmail({
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: 'Forgot Password',
        html: html
    }); 
    return info;
}

module.exports = sendEmail;