const nodemailer = require('nodemailer');

// Generate a random 6-digit number, padded with zeroes
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Configure the nodemailer transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

// Send the HTML styled OTP email
const sendOtpEmail = async (receiverEmail, otpCode) => {
    try {
        if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
            console.error("Missing SMTP credentials in .env. Email skipped.");
            return false;
        }

        const mailOptions = {
            from: `"AstroSera Team" <${process.env.SMTP_EMAIL}>`,
            to: receiverEmail,
            subject: 'Your Account Verification Code',
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #4f46e5; text-align: center; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Account Verification</h2>
                <p>Hello Explorer,</p>
                <p>Welcome to AstroSera! Please use the following 6-digit One-Time Password (OTP) to verify your account.</p>
                
                <div style="background-color: #f3f4f6; border-radius: 8px; padding: 24px; text-align: center; margin: 30px 0;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1f2937;">${otpCode}</span>
                </div>
                
                <p>This code is valid for 10 minutes. If you did not sign up for AstroSera, please ignore this email safely.</p>
                <br>
                <p>Best regards,<br><strong>AstroSera Team</strong></p>
            </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return false;
    }
};

module.exports = {
    generateOtp,
    sendOtpEmail
};
