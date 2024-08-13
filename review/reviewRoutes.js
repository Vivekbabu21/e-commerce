const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');

router.use(methodOverride('_method'));


const {addReview,getReviewsByProduct,addReviewPage,deleteReview,editReview,editReviewPage} = require('./reviewController');

router.get('/:id',addReviewPage);
router.post('/', addReview );
router.get('/:id', getReviewsByProduct);
router.delete('/:id',deleteReview);
router.put('/update/:id',editReview);
router.get('/update/:id',editReviewPage);









module.exports=router