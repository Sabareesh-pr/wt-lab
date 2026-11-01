const mongoose = require('mongoose');
module.exports = mongoose.model('User', new mongoose.Schema({
 name: {type: String, required: true, maxlength: 80},
 email: {type: String, required: true, unique: true, lowercase: true},
 password: {type: String, required: true, select: false},
 role: {type: String, enum: ['user','admin'], default: 'user'}
}, {timestamps: true}));
