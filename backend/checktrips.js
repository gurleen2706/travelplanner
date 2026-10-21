const mongoose = require("mongoose");
require("dotenv").config();
const Trip = require("./models/trip");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB:", mongoose.connection.name);
    console.log("Collections available:", Object.keys(mongoose.connection.collections));

    const trips = await Trip.find();
    console.log("Trips in DB:", trips);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit();
  }
})();
