const express = require('express');
const mongoose = require('mongoose');
const {User} = require('../users/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {Product} = require('../products/productModel');
const { Category } = require('../category/categoryModel');


const loginUser = async(req,res)=>{
    res.render('login');

}

const login = async (req, res) => {
    try{
        let user = await User.findOne({email:req.body.email});
        if(!user) return res.status(400).send('Invali email or password');
    //     console.log(req.body.password);
    //    console.log(user.password);

       const validPassword = await bcrypt.compare(req.body.password,user.password);
       if(!validPassword) return res.status(400).send('Invali email or password');
       else{
        const token = user.generateAuthToken();

       res.header('x-token', token);
       res.cookie('x-token',token,{httpOnly:true,maxAge: 24 * 60 * 60 * 1000});
       
        // res.send(user);

        const categories =await Category.find();
        user = await User.findById(user._id);

    // res.send(products);
    res.render('categoryViews',{categories,user});
       }
       
    }
    catch(ex){
        console.log(ex);
    }
    
}



module.exports = {login,loginUser}
