const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    context: {
        type: String,
        enum: ['signup', 'forgot_password', 'change_password'],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // Document will automatically be deleted after 5 minutes
    }
});

module.exports = mongoose.model('Otp', otpSchema);
