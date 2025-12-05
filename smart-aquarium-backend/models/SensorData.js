const mongoose = require("mongoose");

const SensorSchema = new mongoose.Schema(
  {
    temperature: { type: Number, required: false },
    humidity: { type: Number, required: false },
    tds: { type: Number, required: false },
    ultrasonic: { type: Number, required: false },
    servo: { type: String, default: "Idle" }
  },
  { timestamps: true } // VERY IMPORTANT for graph
);

module.exports = mongoose.model("SensorData", SensorSchema);
