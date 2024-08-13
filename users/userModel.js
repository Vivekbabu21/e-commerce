const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');



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

userSchema.methods.generateAuthToken =function(){
    const token = jwt.sign({_id:this._id},'BABU');
    return token;
}

const User = mongoose.model('User', userSchema);



module.exports = {
    User,userSchema
  };