const mongoose = require('mongoose');
module.exports = mongoose.model('Event', new mongoose.Schema({
 name: {type: String, required: true, maxlength: 120},
 category: {type: String, enum: ['Technical','Workshop','Cultural','Sports'], required: true},
 fee: {type: Number, min: 0, default: 0},
 seats: {type: Number, min: 0, required: true}, date: Date
}, {timestamps: true}));
