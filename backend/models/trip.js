const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    ref: 'User', 
    required: false // This ensures every trip must belong to a user
  },
  destination: String,
  startDate: Date,
  endDate: Date,
  places: [String],
  itinerary: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);