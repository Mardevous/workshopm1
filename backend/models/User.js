const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true, //去掉前后空格
    },
    password: {
        type: String,
        required: true
    },
},{timestamps: true});

module.exports = mongoose.model('User', userSchema);