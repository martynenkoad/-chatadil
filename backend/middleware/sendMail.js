const nodemailer = require("nodemailer")

/**
 * @description Send emails.
 * 
 * Required options: 
 * 1. Send email from app to wanted user: 
 *     - email (of the user)
 *     - subject (optional)
 *     - html (optional)
 * 2. Send email from the user to the app's main email:
 *     - fromEmail (of the user)
 *     - toEmail (email of the app)
 *     - subject (optional)
 *     - html (optional)
 * 
 * @param {Object} options 
 */
const sendMails = (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        logger: true
    })

    let mailOptions = {
        from: options.fromEmail || process.env.EMAIL || "martynenkoad4@gmail.com",
        to: options.toEmail || options.email || "martynenkoad4@gmail.com",
        subject: options.subject || "Welcome!",
        html: options.html || "<div>Glad to see you here!</div>"
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(`Error: ${error.message}`)
        } 
        
        console.log(`New message sent: ${info.response}`)
    })
}

module.exports = sendMails