const mongoose= require('mongoose');

const productSchema = new mongoose.Schema({
    name : String,
    price : Number,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },    stock : Number,
    imageUrl : String,
    brand: {
        type: String,
        required: true
    }

})

const Product = mongoose.model('Product',productSchema);

module.exports = {
    Product
}