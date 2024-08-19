const mongoose = require('mongoose');
const express = require('express');
const router= express.Router();
const path = require('path');



const {addCategory,getCategory,getCategories,updateCategory,deleteCategory} = require('./categoryController');
const login = require('../middleware/login');


const multer = require('multer');

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

router.use(login);
router.post('/', upload.single('image'),addCategory);
router.get('/',login,getCategories);
router.get('/:id', getCategory);
router.put('/:id',upload.single('image'), updateCategory);
router.delete('/:id', deleteCategory);







module.exports = router;