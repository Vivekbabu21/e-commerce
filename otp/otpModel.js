const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    otp: String,
    expiresAt: Date,
    createdAt: { type: Date, default: Date.now }
});

const OTP = mongoose.model('OTP', otpSchema);

module.exports = {
    OTP
}