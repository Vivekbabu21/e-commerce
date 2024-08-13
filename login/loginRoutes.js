const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


const {login,loginUser} = require('./loginController');


router.post('/', login );
router.get('/', loginUser );





module.exports=router;

