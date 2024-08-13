const express = require('express');
const router = express.Router();
const login = require('../middleware/login');
const methodOverride = require('method-override');

router.use(methodOverride('_method'));


const { addToWishlist,removeWishlist,getWishlistItems} = require('./wishlistControllers');




router.post('/add/:id',addToWishlist );

router.delete('/remove/:id', removeWishlist);

router.get('/', getWishlistItems );

module.exports = router;
