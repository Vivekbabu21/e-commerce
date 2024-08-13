const mongoose = require('mongoose');
const express = require('express');
const router= express.Router();
const {Product} = require('./productModel');
const { User } = require('../users/userModel');
const { Review } = require('../review/reviewModel');

const { Category } = require('../category/categoryModel');

const path = require('path');



const multer = require('multer');
// const upload = multer({ dest: 'uploads/' })

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({ storage: storage  });

router.use('/uploads', express.static(path.join(__dirname,'uploads')));

const getProducts = async (req, res) => {
    let query = {};

        if (req.query.category) {
            const category = await Category.findOne({ name: req.query.category });

            if (category) {
                query.category = category._id;
            } else {
                query.category = null;
            }
        }
        // if (req.query.brand) {
        //     query.brand = req.query.brand;
        // }
        if (req.query.name) {
            query.name = { $regex: new RegExp(req.query.name, 'i') }; 
        }
        
        const products = await Product.find(query).populate('category');
    const user = await User.findById(req.user._id);
    // res.send(products);
    res.render('productViews',{products,user});
    
}

const addProduct = async (req, res) => {
    try{
        const categoryId =new mongoose.Types.ObjectId(req.body.category);
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(400).send({ message: 'Invalid category ID.' });
        }
        const product = new Product({ 
            name : req.body.name,
            price : req.body.price,
            category : categoryId,
            stock : req.body.stock,
            brand: req.body.brand,

        });
        if (req.file) {
            product.imageUrl = `/uploads/${req.file.originalname}`;
        }
            await product.save();
            res.send(product);
    }
    catch(error){
        res.status(500).send({ message: error.message });
    }
    
}

const getProduct = async (req, res) => {
    const productId = req.params.id;
    const product =await Product.findById(req.params.id).populate('category','name').exec();
    // const reviews = await Review.find({productId});

    const reviews = await Review.aggregate([
        { $match: { productId:new mongoose.Types.ObjectId(productId) } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails"
          }
        },
        { $unwind: '$userDetails' } 
      ]);
    console.log(reviews);
    // res.send(product);
    const user = await User.findById(req.user._id);
    res.render('singleProduct',{product,user,reviews});

    
}

const updateProduct = async (req, res) => {
   try{
    const categoryId =new mongoose.Types.ObjectId(req.body.category);
    let products = {
        name : req.body.name,
        price : req.body.price,
        category : categoryId,
        stock : req.body.stock,
        brand: req.body.brand,
    };

    if (req.file) {
        products.imageUrl = `/uploads/${req.file.originalname}`;
    }

     products = await Product.findByIdAndUpdate(req.params.id, products, { new: true });
    res.send(products);
   } 
   catch(ex){
    console.log('error:',ex);
   }
    
}

const deleteProduct = async (req, res) => {
    const products =await Product.findByIdAndDelete(req.params.id)
    res.send(products);
    
}

module.exports = {
    addProduct,getProduct,getProducts,updateProduct,deleteProduct
}
