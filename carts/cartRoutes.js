const mongoose = require('mongoose');
const express = require('express');
const router= express.Router();
const methodOverride = require('method-override');

router.use(methodOverride('_method'));

const { addCart,getCarts,getCart,deleteCart} = require('./cartController');
const login = require('../middleware/login');


router.post('/',addCart);
router.get('/', getCarts);
router.get('/:id', getCart);
router.delete('/:id', deleteCart);












module.exports = router;