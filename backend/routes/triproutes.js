const express = require('express');
const router = express.Router();
const Trip = require('../models/trip');
const { generateItinerary } = require('../utils/itineraryGenerator');
const optionalAuth = require('../middleware/optionalAuth'); 

router.post('/', optionalAuth, async (req, res) => { 
  try {
    const { destination, startDate, endDate, places } = req.body;
    
    // 1. Date Validation
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid date format." });
    }

    // 2. Generate Itinerary
    const calculatedDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const itineraryResult = await generateItinerary(destination, places, calculatedDays);
    
    // 3. Identify User
    const userId = req.user ? req.user.userId : "guest";

    // 4. Create and Save
    const newTrip = new Trip({
      userId, 
      destination, 
      startDate: start,
      endDate: end,
      places,
      itinerary: itineraryResult
    });

    await newTrip.save();
    res.status(201).json({ message: "Trip saved!", trip: newTrip });
  } catch (error) {
    console.error("DEBUG ERROR:", error); // Check your terminal for this!
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;