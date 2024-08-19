const mongoose = require('mongoose');
const express = require('express');
const router= express.Router();
const login = require('../middleware/login');

const {addOrder,getOrders,getOrder, updateOrder,deleteOrder,placeOrder} = require('./orderController');

router.use(login);

router.post('/',login, addOrder);
router.get('/',login, getOrders);
router.get('/:id',login, getOrder);
router.put('/:id',login, updateOrder);
router.delete('/:id',login, deleteOrder);
router.post('/order',login,placeOrder);








module.exports = router;