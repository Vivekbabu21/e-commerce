const express = require('express');
const router = express.Router();
const login = require('../middleware/login');
const methodOverride = require('method-override');

router.use(methodOverride('_method'));


const { addToWishlist,removeWishlist,getWishlistItems} = require('./wishlistControllers');




router.use(login);

router.post('/add/:id',login,addToWishlist );

router.delete('/remove/:id',login, removeWishlist);

router.get('/',login, getWishlistItems );

module.exports = router;
