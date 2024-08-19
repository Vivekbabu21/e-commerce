const express = require('express');
const mongoose = require('mongoose');
const {User} = require('./userModel');
const bcrypt = require('bcrypt');



const getUsers = async (req, res) => {
    const users =await User.find().sort('name').select('name -_id');
    // res.send(users);
    res.render('register');

    
}

const addUser = async (req, res) => {
    try{
        let user = await User.findOne({email:req.body.email});
        if(user) return res.status(400).send('User already registered');
            
        user = new User({ 
        name: req.body.name,
        email:req.body.email,
        password:req.body.password
    });
    const salt =await bcrypt.genSalt(10);
    user.password=await bcrypt.hash(user.password,salt);
    
    await user.save();
    res.send(user);
    }
    catch(ex){
        console.log(ex);
    }
    
}

const getUser = async (req, res) => {
    const users =await User.findById(req.params.id);
    res.send(users);
    
}

module.exports = {
    addUser,getUsers,getUser
}
