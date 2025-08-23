const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (to, subject, html) => {
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to,
        subject,
        html,
    };

    try {
        const info = await sgMail.send(mailOptions);
        console.log("Mail sent successfully:", info[0].statusCode);
        return info;
    } catch (err) {
        console.error("Mail failed:", err.message);
        throw new Error("Failed to send email");
    }
};

module.exports = sendMail;