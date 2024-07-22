const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use any email service
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Your OTP for Password Reset',
        text: `Your OTP for password reset is: ${otp}`
    };

    await transporter.sendMail(mailOptions);
};

const generateOtp = () => {
    return crypto.randomBytes(3).toString('hex'); // Generates a 6-digit OTP
};

module.exports = { sendOtpEmail, generateOtp };
