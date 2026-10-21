require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Trip = require("./models/trip");
const authRoutes = require("./routes/authroutes");
const { generateItinerary } = require("./utils/itineraryGenerator");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to DB:", mongoose.connection.name);
  })
  .catch(err => console.error("DB connection error:", err));

  app.post("/api/trips", async (req, res) => {
  console.log("Incoming body:", req.body);
  try {
    const { userId,  destination, startDate, endDate, places } = req.body;

const totalDays =
  Math.max(
    1,
    Math.ceil(
      (new Date(endDate) - new Date(startDate)) /
      (1000 * 60 * 60 * 24)
    ) + 1
  );

const itinerary = generateItinerary(
  destination,
  places,
  totalDays
);

    const trip = new Trip({
      userId,
      destination,
      startDate,
      endDate,
      places,
      itinerary
    });

    await trip.save();
    console.log("Trip saved with _id:", trip._id);
    res.status(201).json(trip);
  } catch (err) {
    console.error("Error saving trip:", err);
    res.status(400).json({ error: err.message });
  }
});


// Auth routes
app.use("/api/auth", authRoutes);

app.get("/api/trips/:userId/:destination", async (req, res) => {
  try {
    const { userId, destination } = req.params;

    const trip = await Trip.findOne({
      userId,
      destination: new RegExp(`^${destination}$`, "i")
    }).sort({ createdAt: -1 });

    if (!trip) {
      return res.status(404).json({ message: "No trip found" });
    }

    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
