const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');

router.use(methodOverride('_method'));


const {addReview,getReviewsByProduct,addReviewPage,deleteReview,editReview,editReviewPage} = require('./reviewController');

const login = require('../middleware/login');


router.use(login);

router.get('/:id',login,addReviewPage);
router.post('/',login, addReview );
router.get('/:id',login, getReviewsByProduct);
router.delete('/:id',login,deleteReview);
router.put('/update/:id',login,editReview);
router.get('/update/:id',login,editReviewPage);









module.exports=router