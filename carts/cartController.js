const {Cart} = require('./cartModel');
const {Product} = require('../products/productModel');
const { User } = require('../users/userModel');


const getCarts = async (req, res) => {
    const carts =await Cart.find().populate('userId', 'name email')
    .populate('productId', 'name price category imageUrl')
    .exec();
    const user = await User.find({userId:req.user._id});
    res.send(carts);
    // res.render('cart',{carts,user});

    
}

const getCart = async (req, res) => {
    const cartItems =await Cart.find({userId:req.user._id}).populate('userId', 'name email')
    .populate('productId', 'name brand price category imageUrl')
    .exec();;
    const user = await User.find({userId:req.user._id});
    // res.send(carts);
    res.render('cart',{cartItems,user});


    
}

const addCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id;

        if (quantity <= 0) {
            return res.status(400).send('Quantity must be greater than zero.');
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).send('Invalid product ID');
        }


        if (quantity > product.stock) {
            return res.status(400).send(`Only ${product.stock} items are available in stock.`);
        }
        
        const cart = new Cart({
            userId,
            productId,
            quantity
        });

        let totalAmount = 0;
        
        totalAmount = product.price*quantity;

        cart.totalAmount = totalAmount;

        const carts = await Cart.aggregate([
            {
                $group: {
                  _id: null,
                  totalPrice:{
                    $sum:"$totalAmount"
                  }
                }
              }
        ]);
        // console.log(carts[0].totalPrice+totalAmount);
        // const total = carts[0].totalPrice+totalAmount;
        let total = totalAmount;
        if (carts.length > 0) {
            total += carts[0].totalPrice;
        }
        if(total>250000){
            return res.status(400).send("Order Amount exceeded");
        }
        else{
        await cart.save();

        const cartItems =await Cart.find().populate('userId', 'name email')
        .populate('productId', 'name price category imageUrl')
        .exec();;
        // res.send(cart);
        const user = await User.find({userId:req.user._id});

        // res.render('cart',{cartItems,user});
        res.redirect(`/api/carts/${userId}`);



        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};





const deleteCart = async (req, res) => {
    try {
        const cartItem = await Cart.findByIdAndDelete(req.params.id);
        if (!cartItem) {
            return res.status(404).send({ message: 'Cart item not found' });
        }
        const cartItems =await Cart.find().populate('userId', 'name email')
        .populate('productId', 'name price category imageUrl')
        .exec();;
        // res.send(cart);
        const user = await User.find({userId:req.user._id});
        res.render('cart',{cartItems,user}); 
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

module.exports = { addCart,getCarts,getCart,deleteCart}