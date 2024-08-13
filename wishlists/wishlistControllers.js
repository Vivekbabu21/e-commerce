const { User } = require('../users/userModel');
const {Wishlist} = require('./wishlistModel');


const addToWishlist = async (req, res) => {
    try {
        const userId = req.user._id; 
        const  productId  = req.params.id;
        // console.log(req.params.id);

        let wishlist = await Wishlist.findOne({ userId });

         if (!wishlist) {
             wishlist = new Wishlist({
                 userId,
                 products: [productId]
             });
         } else {
             if (!wishlist.products.includes(productId)) {
                 wishlist.products.push(productId);
             }
         }
 
         await wishlist.save();
 
         res.send('Product added to wishlist...');
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const removeWishlist = async (req, res) => {
    try {
        const userId = req.user._id; 
        const productId = req.params.id; 
        const wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            return res.status(404).send('Wishlist not found for the user.');
        }

        const updatedWishlist = await Wishlist.findByIdAndUpdate(
            wishlist._id, 
            { $pull: { products: productId } }, 
            { new: true } 
        );

        // res.send(updatedWishlist);
        res.redirect('/api/wishlist');

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


const getWishlistItems = async (req, res) => {
    try {
        const userId = req.user._id; 
        const wishlist = await Wishlist.findOne({ userId }).populate('products');
        console.log(wishlist);
        
        if (!wishlist) {
            return res.status(404).send('Wishlist not found for the user.');
        }
        // res.send(wishlist.products);
        res.render('wishlistView',{wishlist});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


module.exports = { addToWishlist,removeWishlist,getWishlistItems};