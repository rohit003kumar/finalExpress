const express = require('express');
const {signUp,Login, Logout, forgotPassword, resetPassword} = require('../controllers/auth.controller.js')


const authRouter = express.Router()

authRouter.post("/signup",signUp)
authRouter.post("/login",Login)
authRouter.post("/logout",Logout);
authRouter.post('/forgot-password', forgotPassword);
authRouter.put('/reset-password/:token', resetPassword);



authRouter.get('/test-email', async (req, res) => {
  try {
    await sendMail({
      to: 'yourtestreceiver@gmail.com',
      subject: 'Test Email from Dobhi App',
      text: 'This is a test email sent from the FoldMate/Dobhi App backend.'
    });
    res.status(200).json({ message: 'Test email sent successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send test email' });
  }
});

module.exports = authRouter;