const {Review} =require('./reviewModel');
const {Order} = require('../orders/orderModel');
const mongoose= require('mongoose');
const { Product } = require('../products/productModel');

// const {Order} = require('../orders/orderModel');


// const addReviewPage= async(req,res)=>{
//     const productId = req.params.productId;
//     // const product = await Product.findById(productId);
//     // if (!product) {
//     //     return res.status(404).send('Product not found');
//     // }
//     res.render('addReview', { productId });
// }

const addReviewPage = async (req, res) => {
    const product =await Product.findById(req.params.id);
    // res.send(product);
    // const user = await User.findById(req.user._id);
    res.render('addReview',{product});

    
}

const editReviewPage = async (req, res) => {
    const review = await Review.findById(req.params.id);
    res.render('editReview',{review});

    
}

const addReview = async(req,res) =>{
    try {
        const userId = req.user._id;
        const { productId, rating, comment } = req.body;


        const order = await Order.findOne({
            'products.productId': productId,
            userId
        });

        if (!order) {
            return res.status(400).send('Invalid review request. Ensure the product was purchased.' );
        }

        const existingReview = await Review.findOne({ productId, userId });

        if (existingReview) {
            return res.status(400).send('You have already reviewed this product.');
        }

        const review = new Review({
            userId,
            productId,
            rating,
            comment
        });

        await review.save();

        await Order.updateOne(
            { 
                _id: order._id, 
                'products.productId': productId 
            },
            { 
                $set: {
                    'products.$.review': {
                        userId,
                        rating,
                        comment,
                        createdAt: review.createdAt
                    },
                    'products.$.reviewId': review._id
                }
            }
        );
        // res.status(201).send(review);
        res.redirect(`/api/orders/${review.userId}`);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const getReviewsByProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const reviews = await Review.find({ productId }).populate('userId', 'name');
        res.send(reviews);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const userId = req.user._id;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).send('Review not found.');
        }

        if (review.userId.toString() !== userId.toString()) {
            return res.status(403).send('You are not authorized to delete this review.');
        }

        await Review.findByIdAndDelete(reviewId);

        await Order.updateMany(
            { 
                'products.reviewId': reviewId,
                userId
            },
            { 
                $set: {
                    'products.$.review': null,
                    'products.$.reviewId': null
                }
            }
        );

        // res.send('Review deleted successfully.');
        res.redirect(`/api/orders/${review.userId}`);

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
    
}

const editReview = async(req, res) => {
    try {
        const reviewId = req.params.id;
        const { rating, comment } = req.body;
        const userId = req.user._id;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).send('Review not found.');
        }

        if (review.userId.toString() !== userId.toString()) {
            return res.status(403).send('You are not authorized to edit this review.');
        }

        review.rating = rating;
        review.comment = comment;
        review.updatedAt = new Date();  

        await review.save();

        const order = await Order.findOne({
            'products.reviewId': reviewId,
            userId
        });

        if (order) {
            await Order.updateOne(
                { 
                    _id: order._id, 
                    'products.reviewId': reviewId 
                },
                { 
                    $set: {
                        'products.$.review': {
                            userId,
                            rating,
                            comment,
                            createdAt: review.createdAt
                        }
                    }
                }
            );
        }

        // res.status(200).send(review);
        res.redirect(`/api/orders/${review.userId}`);

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};




module.exports = {
    addReview,getReviewsByProduct,addReviewPage,deleteReview,editReview,editReviewPage
}