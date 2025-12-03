const mongoose = require("mongoose");

const SensorSchema = new mongoose.Schema({
  temperature: Number,
  ph: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SensorData", SensorSchema);
