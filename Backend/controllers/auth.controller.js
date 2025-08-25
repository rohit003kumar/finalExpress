const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const genToken = require('../config/token');


//register
const signUp = async (req, res) => {
    try {
        const { name, email, password, role, contact, address, location, range } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            contact,
            address,
            location,
            range: role === 'washerman' ? 500 : null,
            
        });

        await user.save();

        console.log('User saved:', user);

        // Generate token
        const token = await genToken(user._id, user.role);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(201).json({
            token,
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (error) {
        console.error('SignUp Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}



// Login
const Login = async (req, res) => {
    try {
        const { email, password,role } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email credentials' });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: 'Invalid password credentials' });

            // 3. Match role
      if (user.role !== role) {
      return res.status(403).json({ message: `Access denied for role '${role}'` });
    }

        // Create token
        // Generate token
        const token = await genToken(user._id, user.role);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        // console.log("Login",Login);

        // res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
        res.json({ token, user: { id: user._id, name: user.name, role: user.role } });

    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


//Logout
const Logout = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({ message: "Logout successfully" });

    } catch (error) {
        res.status(500).json({ message: `logout error ${error}` });
    }
}




const crypto = require('crypto');
// const bcrypt = require('bcryptjs');
const sendMail = require('../utils/sendMail');
const generateResetToken = require('../utils/generateResetToken');
// const User = require('../models/user.model');

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  const { resetToken, hashedToken, expireTime } = generateResetToken();

  console.log('🔐 Reset token sent in email:', resetToken);
console.log('🧬 Hashed token saved in DB:', hashedToken);

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = expireTime;
  await user.save();


// const resetURL = `http://localhost:5173/reset-password/${resetToken}`;
// or if deployed:
// const resetURL = `https://yourfrontend.com/reset-password/${resetToken}`;
const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;


  const message = `You requested a password reset. Click the link to reset your password: ${resetURL}`;

  try {
    await sendMail({
      to: user.email,
      subject: 'Password Reset',
      text: message,
    });
    res.status(200).json({ message: "Reset link sent to email" });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(500).json({ message: "Failed to send email" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
console.log('📩 Token received in URL:', token);
console.log('🧬 Hashed token to search DB:', hashedToken);

  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({ message: "Password has been reset successfully" });
};


module.exports = { signUp, Login, Logout, forgotPassword, resetPassword };


