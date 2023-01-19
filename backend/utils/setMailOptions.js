/**
 * @description    Create a password recovery email object.
 * @param email    required: the email of the user.
 * @param name     required: the name of the user.
 * @param url      required: the url to redirect to.
 * @returns        a created email object.
 */ 
const setPasswordRecoveryMail = (email, name, url) => {
    return {
        email,
        subject: "CHATADIL | Reset Your Password",
        html: `
        <div>
          <h2>Welcome back, ${name}!</h2>
          <p>Thank you for using our Chat App :)</p>
          <p>If you are ready to reset your password, please follow this link: <a href=${url}>${url}</a>.</p>
          <br />
          <p>Hope you enjoy with "Chatadil"!</p>
        </div>
        `
    }
}

/**
 * @description        Send the question to a developer.
 * @param fromEmail    required: the email of the user who is going to send the email.
 * @param name         required: the name of the current user.
 * @param question     required: the question of the current ser.
 * @returns            a created email object.
 */
const setSupportEmail = (fromEmail, name, question) => {
  return {
    fromEmail,
    toEmail: process.env.EMAIL || "martynenkoad4@gmail.com",
    subject: `CHATADIL | Support email from ${name}`,
    html: `
    <div>
      <h3>Email from: ${fromEmail}.</h3>
      <br />
      <p>
        ${question}
      </p>
    </div>
    `
  }
}

module.exports = {
    setPasswordRecoveryMail,
    setSupportEmail
}