const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const {User} = require('../users/userModel');

router.get('/:token',async(req,res)=>{
    
    const token = req.params.token;
   

    try{
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpires: { $gt: Date.now() }
        });
    
        if (!user || !user.resetRequested) {
            return res.status(400).send('Invalid or expired token');
        }

        res.render('resetpassword');

    }
    catch(ex){
        console.error('failed:',ex.message);
        res.status(400).send('Invalid token');
    }})


router.post('/:token',async(req,res)=>{
    const token = req.params.token;
    const { password, password2 } = req.body;

try{
    const user = await User.findOne({
        resetToken: token,
        resetTokenExpires: { $gt: Date.now() }
    });

    if (!user || !user.resetRequested) {
        return res.status(400).send('Invalid or expired token');
    }
    if(password!==password2){
    res.send('password does not match..');
}
       const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        user.resetToken = undefined;
        user.resetTokenExpires = undefined;
        user.resetRequested = false; 
        await user.save();
        
        res.redirect('/api/login');

}
catch(ex){
    console.error('failed:',ex.message);
    res.status(400).send('Invalid token');
}
;
})

module.exports= router;