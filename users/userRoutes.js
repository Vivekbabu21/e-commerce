const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


const {addUser,getUsers,getUser} = require('./userController');


router.post('/',addUser);
router.get('/', getUsers);
router.get('/:id', getUser);




module.exports=router;

