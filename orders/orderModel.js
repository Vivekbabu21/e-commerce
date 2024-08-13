const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    products: [
        {
            productId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Product', 
                required: true 
            },
            quantity: { 
                type: Number, 
                required: true,
                min: 1
            },
            orderedAt :{
                type: Date, default: Date.now
            },
            review: {
                userId: { 
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: 'User'
                },
                rating: { 
                    type: Number, 
                    min: 1, 
                    max: 5 
                },
                comment: { 
                    type: String 
                },
                createdAt: { 
                    type: Date, 
                    default: Date.now 
                }
            },
            reviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' }
            
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    }
});



const Order = mongoose.model('Order', orderSchema);

module.exports = { Order };
