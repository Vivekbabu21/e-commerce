const mongoose = require('mongoose');
const express = require('express');
const router= express.Router();
const {Category} = require('./categoryModel');
const {User} = require('../users/userModel');

const path = require('path');



const multer = require('multer');
const { Product } = require('../products/productModel');
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

const getCategories = async (req, res) => {

    const categories =await Category.find();
    const user = await User.findById(req.user._id);
    // res.send(categories);
    res.render('categoryViews',{categories,user});

    // const { page = 1, limit = 10 } = req.query; 
    //     const skip = (page - 1) * limit;

    //     const categories = await Category.find()
    //         .skip(parseInt(skip))
    //         .limit(parseInt(limit));

    //     const totalCategories = await Category.countDocuments();
    //     const totalPages = Math.ceil(totalCategories / limit);

    //     const user = await User.findById(req.user._id);

    //     res.render('categoryViews', {
    //         categories,
    //         user,
    //         currentPage: parseInt(page),
    //         totalPages,
    //         limit: parseInt(limit)
    //     });
    
}

const addCategory = async (req, res) => {
    try{
        const category = new Category({ 
            name : req.body.name,
        });
        if (req.file) {
            category.imageUrl = `/uploads/${req.file.originalname}`;
        }
            await category.save();
            res.send(category);
    }
    catch(error){
        res.status(500).send({ message: error.message });
    }
    
}

const getCategory = async (req, res) => {
    const categoryId =new mongoose.Types.ObjectId(req.params.id);

    // const category =await Category.findById(req.params.id);
    const category = await Product.find({category:categoryId});
    res.send(category);
    // const user = await User.findById(req.user._id);
    // res.render('singleProduct',{product,user});

    
}

const updateCategory = async (req, res) => {
   try{
    console.log('Request Params ID:', req.params.id);
    console.log('Request Body:', req.body);
    console.log('Request File:', req.file);
    if (!req.params.id) {
        return res.status(400).send({ message: 'Category ID is required' });
    }
    
    if (!req.body.name) {
        return res.status(400).send({ message: 'Category name is required' });
    }
    const categories = {
        name : req.body.name,
    };

    if (req.file) {
        categories.imageUrl = `/uploads/${req.file.originalname}`;
    }

     const category = await Category.findByIdAndUpdate(req.params.id, categories, { new: true });
    res.send(category);
   } 
   catch(ex){
    console.log('error:',ex);
   }
    
}

const deleteCategory = async (req, res) => {
    const categories =await Category.findByIdAndDelete(req.params.id)
    res.send(categories);
    
}

module.exports = {
    addCategory,getCategory,getCategories,updateCategory,deleteCategory
}

