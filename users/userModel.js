const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();




const userSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    required:true
  },
  email: { 
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true 
  },
  password: { 
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024 
  },
  resetToken: String,
  resetTokenExpires: Date,
  resetRequested: { 
    type: Boolean, 
    default: false 
}
});

const jwtSecret = process.env.JWT_SECRET;
userSchema.methods.generateAuthToken =function(){
  try{
    const token = jwt.sign({_id:this._id},jwtSecret);
    return token;
  } catch (err) {
    console.error('Error generating token:', err);
    throw new Error('Token generation failed');
}
}

const User = mongoose.model('User', userSchema);



module.exports = {
    User,userSchema
  };