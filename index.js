const mongoose = require('mongoose');
const express = require('express');
const usersRouter = require('./users/userRoutes');
const productsRouter = require('./products/productRoutes');
const ordersRouter = require('./orders/orderRoutes');
const cartsRouter = require('./carts/cartRoutes');
const loginRouter = require('./login/loginRoutes');
const wishlistRouter = require('./wishlists/wishlistRoutes');
const categoryRouter = require('./category/categoryRoutes');
const reviewRouter = require('./review/reviewRoutes.js');
const forgetpassword=require('./forgotPassword/forgetpassword.js');
const resetpassword=require('./forgotPassword/resetpassword.js');
const otpRouter = require('./otp/otpRoutes.js');
const login  = require('./middleware/login');
const logout = require('./login/logout');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const path = require('path');
const app = express();
require('dotenv').config();




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

app.use('/uploads', express.static(path.join(__dirname,'uploads')));



app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

app.use(express.json());
app.use('/api/users',usersRouter);
app.use('/api/products',login,productsRouter);
app.use('/api/orders',login,ordersRouter);
app.use('/api/carts',login, cartsRouter);
app.use('/api/review',login,reviewRouter);
app.use('/api/category',login,categoryRouter);
app.use('/api/login',loginRouter);
app.use('/logout',logout);
app.use('/api/forgetpassword',forgetpassword);
app.use('/resetpassword',resetpassword);
app.use('/', otpRouter);
app.use('/api/wishlist',login,wishlistRouter);
app.use(methodOverride('_method'));

app.use(login);

app.get('/', async(req,res)=>{
    res.render('home');
})





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
  