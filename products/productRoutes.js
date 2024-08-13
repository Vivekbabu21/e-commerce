const mongoose = require('mongoose');
const express = require('express');
const router= express.Router();
const path = require('path');


const {addProduct,getProducts,getProduct,updateProduct,deleteProduct} = require('./productController');
const login = require('../middleware/login');


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

router.post('/', upload.single('image'),addProduct);
router.get('/',getProducts);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);







module.exports = router;