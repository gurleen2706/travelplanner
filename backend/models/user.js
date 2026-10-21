// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  // We keep an array of trip IDs to easily look up all trips for a user
  trips: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Trip' 
  }]
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);