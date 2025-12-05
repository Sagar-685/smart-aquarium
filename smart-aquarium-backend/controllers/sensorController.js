const SensorData = require("../models/SensorData");

exports.uploadSensorData = async (req, res) => {
  try {
    const { temperature, humidity } = req.body;

    console.log("New Sensor Data:", temperature, humidity);

    const data = await SensorData.create({
      temperature,
      humidity
    });

    res.json({ message: "Sensor data stored", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLatestSensor = async (req, res) => {
  try {
    const latest = await SensorData.findOne().sort({ timestamp: -1 });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
