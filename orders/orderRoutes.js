const mongoose = require('mongoose');
const express = require('express');
const router= express.Router();

const {addOrder,getOrders,getOrder, updateOrder,deleteOrder,placeOrder} = require('./orderController');


router.post('/', addOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);
router.post('/order',placeOrder);








module.exports = router;