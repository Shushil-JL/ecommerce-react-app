const nodemailer = require('nodemailer')

const sendEmail = async (options) => {
    const transposter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        }
    })
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transposter.sendMail(mailOptions)
}

module.exports = sendEmail