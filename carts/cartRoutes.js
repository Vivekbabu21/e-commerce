const mongoose = require('mongoose');
const express = require('express');
const router= express.Router();
const methodOverride = require('method-override');

router.use(methodOverride('_method'));

const { addCart,getCarts,getCart,deleteCart} = require('./cartController');
const login = require('../middleware/login');


router.use(login);

router.post('/',login,addCart);
router.get('/',login, getCarts);
router.get('/:id',login, getCart);
router.delete('/:id',login, deleteCart);












module.exports = router;