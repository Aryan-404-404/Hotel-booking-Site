const nodemailer = require('nodemailer');
require('dotenv').config();

const sendMail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587, // Use 465 for SSL/TLS
        secure: false, // Set to true for port 465
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Mail sent successfully:", info.response);
    } catch (err) {
        console.error("Mail failed:", err.message);
        throw new Error("Failed to send email");
    }
};

module.exports = sendMail;