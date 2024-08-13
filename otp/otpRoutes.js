const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const {OTP} = require('./otpModel');
const nodemailer = require('nodemailer');
const {User} = require('../users/userModel');
const bcrypt = require('bcrypt');

router.post('/send-otp', async(req, res) => {
    try {
        const { email } = req.body;
        const user=await User.findOne({email});
    // if(!user){
    //    return res.send('User not registered');
    // }
        const realOtp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 

        const salt = await bcrypt.genSalt(10);
        const otp = await bcrypt.hash(realOtp, salt);

        await OTP.create({ userId: user._id, otp, expiresAt });

        
        await sendOTPEmail(email, realOtp);

        res.status(200).send('OTP sent successfully');
    } catch (error) {
        res.status(500).send(error);
    }
});


const generateOTP = (length = 4) => {
    let otp = '';
    const characters = '0123456789';
    for (let i = 0; i < length; i++) {
        otp += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return otp;
};

const sendOTPEmail = async (email, otp) => {
    var transport = nodemailer.createTransport({
    // host: "sandbox.smtp.mailtrap.io",
    // port: 2525,
    service: 'gmail',
    auth: {
      user: "vivekkodurikvb@gmail.com",
      pass: "wvhg ranp tmkz qbqw"
    }
  });
const mailOptions = {
    from: 'vivekkodurikvb@gmail.com', 
    to: email,
    subject: 'Your OTP Code',
    html: `Your OTP code is ${otp}. It will expire in 10 minutes.`
};
await transport.sendMail(mailOptions);
};

module.exports = router;