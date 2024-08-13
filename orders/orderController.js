const {Order} = require('./orderModel');
const {Product} = require('../products/productModel');
const {Cart} = require('../carts/cartModel');



const getOrders = async (req, res) => {
    const orders =await Order.find().populate('userId', 'name email')
    .populate('products.productId', 'name price category')
    .exec();
    res.send(orders);
    // res.render('orders',{orders});
    
}

const getOrder = async (req, res) => {
    const orders =await Order.find({userId:req.user._id }).populate('userId', 'name email')
    .populate('products.productId', 'brand name price category imageUrl').populate('products.review.userId','name').populate('products.reviewId','_id')
    .exec();
    // res.send(orders);
    res.render('orders',{orders});



    
}

const addOrder = async (req, res) => {
    try {
        const { orderId, userId, products } = req.body;

        // let totalAmount = 0;

        // for (const item of products) {
        //     const product = await Product.findById(item.productId);
        //     if (!product) {
        //         return res.status(400).send('Invalid product ID');
        //     }
        //     totalAmount += product.price * item.quantity;
        // }

        const TotalAmount = await Order.aggregate([
            {
                $unwind: "$products"
              },
              {
                $lookup: {
                  from: "products",
                  localField: "products.productId",
                  foreignField: "_id",
                  as: "productDetails"
                }
              },
              {
                $unwind: "$productDetails"
              },
              {
                $addFields: {
                  "products.totalPrice": {
                    $multiply: [
                      "$products.quantity",
                      "$productDetails.price"
                    ]
                  }
                }
              },
              {
                $group: {
                  _id: "$_id",
                  orderId: {
                    $first: "$orderId"
                  },
                  userId: {
                    $first: "$userId"
                  },
                  products: {
                    $push: "$products"
                  },
                  totalAmount: {
                    $sum: "$products.totalPrice"
                  }
                }
              }
        ]);
        // console.log(products);

        const order = new Order({
            orderId,
            userId,
            products,
            totalAmount:TotalAmount[0].totalAmount, 
        });

        await order.save();

        for (const item of products) {
            await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity } },
                { new: true }
            );
        }
        
        res.send(order);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const updateOrder = async (req, res) => {
    const { orderId, userId, products } = req.body;


    let totalAmount = 0;

        for (const item of products) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(400).send('Invalid product ID');
            }
            totalAmount += product.price * item.quantity;
        }
    const orders =await Order.findByIdAndUpdate(req.params.id,{
        orderId,
        userId,
        products,
        totalAmount,
    },{new:true});

    res.send(orders);
    
}

const deleteOrder = async (req, res) => {
    const orders =await Order.findByIdAndDelete(req.params.id)
    res.send(orders);
    
}

const placeOrder = async (req,res) => {
    try {
        const carts = await Cart.find({ userId: req.user._id });
        if (!carts) {
            return res.status(404).send('Cart not found');
        }

        let products =[];

            for(const item of carts){
                products.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    orderedAt: new Date()
                });
                const product = await Product.findById(item.productId);
            if (product) {
                product.stock -= item.quantity;
                await product.save();
            }
            }
            const productDetails = await Cart.aggregate([
                {
                    $group: {
                      _id: null,
                      totalPrice:{
                        $sum:"$totalAmount"
                      }
                    }
                  }
            ]);

        // console.log(productDetails[0].totalPrice);
        let order = await Order.findOne({ userId:req.user._id });

        if (order) {
            order.products = [...order.products, ...products];
            order.totalAmount += productDetails[0].totalPrice;
        } else {
            order = new Order({
            userId: carts[0].userId,
            products: products,
            totalAmount: productDetails[0].totalPrice,

        });

    }

        await order.save();
        await Cart.deleteMany({ userId: req.user._id });

        // console.log(products.productId.name);

        res.send('Order Placed');

        // const orders =await Order.find({ userId:req.user._id }).populate('userId', 'name email')
        // .populate('products.productId', 'name price category')
        // .exec();;
        // // res.send(orders);
        // res.render('orders',{orders});

        // res.send(order);

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

module.exports = { addOrder,getOrders,getOrder,updateOrder,deleteOrder, placeOrder}