const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer =require('nodemailer');
const {User} = require('../users/userModel');
const crypto = require('crypto');

router.get('/',(req,res)=>{
    res.render('forgetpassword');
})

router.post('/',async(req,res)=>{
    const email = req.body.email;
    const user=await User.findOne({email});
    if(!user){
       return res.send('User not registered');
    }
    // const SECRET ='secret';


    // const secret= SECRET+user.password;
    // const token = jwt.sign({_id:user._id,email:user.email},secret);

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; 

    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
    user.resetRequested = true; 

    await user.save();

    const link = `http://localhost:3000/resetpassword/${resetToken}`;
    const resetlink=`<a href="${link}">${link}</a>`;

    var transport = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      });
    const mailOptions = {
        from: 'your_email@gmail.com', 
        to: user.email,
        subject: 'Password Reset Link',
        html: `<p>You requested a password reset. Click the link below to reset your password:</p>${resetlink}`
    };
    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending email');
        }
        res.send('Password reset link sent to your email');

    });    
})

module.exports= router;