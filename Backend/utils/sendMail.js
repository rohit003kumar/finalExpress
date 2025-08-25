// utils/sendMail.js
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

const sendMail = async ({ to, subject, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App-specific password
      },
    });

    const mailOptions = {
      from: `"Dobhi App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: `<p>${text.replace(/\n/g, '<br>')}</p>`, // Optional: supports link clicks
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.response);
  } catch (err) {
    console.error('❌ Email sending failed:', err);
    throw new Error('Failed to send email');
  }
};

module.exports = sendMail;
